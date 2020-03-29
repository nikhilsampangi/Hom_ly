const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
  custId: { type: Number, required: true },
  chefId: { type: Number, required: true },
  amount: { type: Number, required: true },
  items: [
    {
      itemName: { type: String, required: true },
      itemCost: { type: Number }
    }
  ],
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 3
  },
  feedBack: {
    type: String
  }
});

TransactionSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("transaction", TransactionSchema);
