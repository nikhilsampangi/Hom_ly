const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
  custId: { type: Number, required: true },
  chefId: { type: Number, required: true },
  date: { type: Date, default: Date.now, required: true },
  amount: { type: Number, required: true },
  items: [
    {
      itemName: { type: String, required: true },
      itemCost: { type: Number },
    },
  ],
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  feedBack: {
    type: String,
  },
});

TransactionSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("transaction", TransactionSchema);
