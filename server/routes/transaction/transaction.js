const express = require("express");
const router = express.Router();
const cors = require("cors");
const auth = require("../middleware_jwt");

const Transaction = require("../../models/transactions.model");
const Chef = require("../../models/chef.model");
const { User } = require("../../models/customer.model");
const transactions = require("../transactions");
// router.use(cors());

const cron = require("../time_schedule/schedule_order");

router.post("/buy_item", auth, buy_item);

function buy_item(req, res) {
  var transData = {
    custId: req.user._id,
    chefId: req.body.id,
    chefName: req.body.chefName,
    amount: req.body.cost,
    items: {
      itemName: req.body.name,
      itemCost: req.body.cost,
    },
  };

  Transaction.create(transData).then((data) => {
    res.send(data._id);
  });
}

router.post("/feedback", feedback);

function feedback(req, res) {
  Transaction.updateOne(
    { _id: req.body.id },
    { rating: req.body.rating, feedBack: req.body.fb }
  ).then(res.send("feedback submitted"));
}

router.get("/get_orders", auth, get_orders);

function get_orders(req, res) {
  Transaction.find(
    { custId: req.user._id },
    { chefName: 1, date: 1, amount: 1, rating: 1, feedBack: 1 },
    { multi: true }
  ).then((orders) => {
    // console.log(orders);
    res.send(orders);
  });
}

router.get("/chef_rating", auth, chef_rating);

function chef_rating(req, res) {
  Transaction.find(
    { chefId: req.user._id },
    { rating: 1, _id: 0 },
    { multi: true }
  ).then((ratings) => {
    res.send(ratings);
  });
}

router.get("/chef_fbs", auth, chef_fbs);

function chef_fbs(req, res) {
  Transaction.find(
    { chefId: req.user._id },
    { _id: 0, date: 1, items: 1, rating: 1, feedBack: 1 },
    { multi: true }
  ).then((fbs) => {
    res.send(fbs);
  });
}

function getTotalCost(orderId, callback) {
  Transaction.aggregate([
    { $match: { _id: orderId } },
    { $unwind: "$items" },
    {
      $group: {
        _id: null,
        totalCost: {
          $sum: { $multiply: ["$items.itemCost", "$items.itemQnty"] },
        },
      },
    },
  ])
    .then((costData) => {
      console.log("\ncost calculated!!!\n " + costData[0].totalCost);
      callback(null, costData[0].totalCost);
    })
    .catch((err) => {
      console.log("\nerror in Cost calculation!!!\n" + err);
      callback("somenting went Wrong in Cost Calculation!!!", null);
    });
}

function getPaymentData(userID, chefID, chef_name, itemData, callback) {
  Transaction.findOne({
    custId: userID,
    chefId: chefID,
    status: "initiated",
  }).then((orderExist) => {
    if (!orderExist) {
      var date = new Date();
      date = date.toISOString();

      const orderData = {
        custId: userID,
        chefId: chefID,
        createdAt: date,
        status: "initiated",
        items: itemData,
        chefName: chef_name,
      };
      Transaction.create(orderData)
        .then((orderCreated) => {
          getTotalCost(orderCreated._id, (err, resp) => {
            if (err) {
              callback(err, null);
            } else {
              const returnData = {
                cost: resp,
                orderID: orderCreated._id,
              };
              callback(null, returnData);
            }
          });
        })
        .catch((err) => {
          callback(err, null);
        });
    } else {
      Transaction.updateOne(
        {
          custId: orderExist.custId,
          chefId: orderExist.chefId,
        },
        { $pull: { items: { $exists: true } } },
        (err, resp) => {
          console.log(
            "\ninside update of existing trabsaction after emptying array\n"
          );
          if (err) {
            callback("somenthing went wrong in existing transaction!!!", null);
          } else {
            Transaction.updateOne(
              {
                custId: orderExist.custId,
                chefId: orderExist.chefId,
              },
              { $set: { items: itemData } },
              (err, resp) => {
                console.log(
                  "\ninside update of existing trabsaction after pushing elements array\n"
                );
                if (err) {
                  callback(
                    "something went wrong in setting exist order items",
                    null
                  );
                } else {
                  getTotalCost(orderExist._id, (err, resp) => {
                    if (err) {
                      callback(err, null);
                    } else {
                      const returnData = {
                        cost: resp,
                        orderID: orderExist._id,
                      };
                      callback(null, returnData);
                    }
                  });
                }
              }
            );
          }
        }
      );
    }
  });
}

router.post("/order", auth, payment);

function payment(req, res) {
  const userId = req.user._id;
  const chefId = req.body.chefid;
  const chefName = req.body.chefname;
  const itemData = req.body.cart;
  User.findOne({
    _id: userId,
  })
    .then((user) => {
      if (!user) {
        res.status(400).send({ message: "No User Exist!!!" });
      } else {
        getPaymentData(user._id, chefId, chefName, itemData, (err, resp) => {
          if (err) {
            res.status(400).send({ message: err });
          } else {
            const paymentData = {
              orderId: new String(resp.orderID),
              customerId: new String(user._id),
              amount: new String(resp.cost),
              email: user.email,
              phoneNumber: new String(user.internalAuth.phoneNum),
            };

            console.log("\n" + paymentData + "\n");

            transactions.payment(paymentData, (err, params) => {
              if (err) {
                res.status(200).send({ message: "error!!!" });
              } else {
                let txn_url = "https://securegw-stage.paytm.in/order/process";

                let form_fields = "";
                for (x in params) {
                  form_fields +=
                    "<input type='hidden' name='" +
                    x +
                    "' value='" +
                    params[x] +
                    "'/>";
                }
                var html =
                  '<html><body><center><h2>Please wait! Do not refresh the page</h2></center><form method="post" action="' +
                  txn_url +
                  '" name="f1">' +
                  form_fields +
                  '</form><script type="text/javascript">document.f1.submit()</script></body></html>';
                res.writeHead(200, { "Content-Type": "text/html" });
                res.write(html);
                res.end();
              }
            });
          }
        });
      }
    })
    .catch((err) => {
      res.status(400).send({ message: "something went wrong!!!" });
    });
}

router.post("/success", success);

function success(req, res) {
  transactions.success(req.body, (err, resData) => {
    if (err) {
      res.status(400).send({ message: err });
    } else {
      const response = JSON.parse(resData);
      console.log("\n" + response + "\n");
      var date = new Date();
      date = date.toISOString();
      const newValues = {
        transactionId: response.TXNID,
        amount: response.TXNAMOUNT,
        updatedAt: date,
        referenceId: response.BANKTXNID,
        modeOfPayment: response.PAYMENTMODE,
        bankName: response.BANKNAME,
      };

      if (response.STATUS === "TXN_FAILURE") {
        newValues["status"] = "failed";
        Transaction.updateOne(
          { _id: response.ORDERID },
          newValues,
          (err, Success) => {
            if (err) {
              res.status(400).send({ message: "something went wrong!!!" });
            } else {
              res.status(400).send({ message: response.RESPMSG });
            }
          }
        );
      } else {
        newValues["status"] = "completed";
        Transaction.updateOne(
          { _id: response.ORDERID },
          newValues,
          (err, Success) => {
            if (err) {
              res.status(200).send({ message: "something went wrong!!!" });
            } else {
              res.status(200).send({ message: response.RESPMSG });
            }
          }
        );
      }
    }
  });
}

router.post("/refund", initiateRefund);

function initiateRefund(req, res) {
  refundData = {
    orderId: "5eb3f6d9be16a93090f04c28",
    txnId: "20200507111212800110168391101503320",
    amount: "100",
  };
  transactions.refund(refundData, (err, response) => {
    if (err) {
      res.satus(400).send({ message: err });
    } else {
      const resData = JSON.parse(response);
      res.status(400).send({ message: resData.body });
    }
  });
}

router.post("/refundStatus", refundStatus);

function refundStatus(req, res) {
  refundData = {
    orderId: "5eb3f6d9be16a93090f04c28",
    refundId: "20200507111212800110168391101503320",
  };
  transactions.refundStatus(refundData, (err, response) => {
    if (err) {
      res.satus(400).send({ message: err });
    } else {
      const resData = JSON.parse(response);
      res.status(400).send({ message: resData.body });
    }
  });
}

router.post("/cron", runCron);

function runCron(req, res) {
  cron.scheduleOrder();
  res.status(200).send({ message: "running cron" });
}

module.exports = router;
