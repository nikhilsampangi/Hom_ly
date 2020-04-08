const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
  custId: { type: String, required: true },
  chefId: { type: String, required: true },
  chefName: { type: String, required: true },
  date: { type: Date, default: Date.now, required: true },
  amount: { type: Number, required: true },
  items: [
    {
      itemName: { type: String, required: true },
      itemQnty: { type: Number, required: true, default: 1 },
      itemCost: { type: Number, required: true },
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

module.exports = mongoose.model("transactions", TransactionSchema);
