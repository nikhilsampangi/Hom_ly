const express = require("express");
const router = express.Router();
const cors = require("cors");
const auth = require("../middleware_jwt");

const Transaction = require("../../models/transactions.model");
const Chef = require("../../models/chef.model");

// router.use(cors());

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

module.exports = router;
