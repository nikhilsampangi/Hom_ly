const express = require("express");
const router = express.Router();
const cors = require("cors");
const auth = require("../middleware_jwt");

const Transaction = require("../../models/transactions.model");
const Chef = require("../../models/chef.model");

// router.use(cors());

router.post("/buy_item", auth, buy_item);

function buy_item(req, res) {
  Chef.findOne({ firstName: req.body.chefName }, { _id: 1 }).then((chef) => {
    // console.log(res._id);
    var transData = {
      custId: req.user._id,
      chefId: chef._id,
      amount: req.body.cost,
      items: {
        itemName: req.body.name,
        itemCost: req.body.cost,
      },
    };

    Transaction.create(transData).then((data) => {
      res.send(data._id);
    });
  });
}

router.post("/feedback", feedback);

function feedback(req, res) {
  Transaction.updateOne(
    { _id: req.body.id },
    { rating: req.body.rating, feedBack: req.body.fb }
  ).then(res.send("feedback submitted"));
}

module.exports = router;
