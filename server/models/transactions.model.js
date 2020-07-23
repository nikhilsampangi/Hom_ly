const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
  custId: { type: String, required: true },

  transactionId: {type:String, default: null},
  
  status: {type:String, enum:['initiated','completed','failed'], required:true},

  referenceId: {type: String, default: null},

  modeOfPayment: {type:String, default: null},

  bankName: {type: String, default: null},
  
  createdAt: {type:Date, default: Date.now},
  
  updatedAt: {type:Date, default: Date.now},  

  chefId: { type: String, required: true },

  chefName: { type: String, required: true },
  
  date: { type: Date, default: Date.now, required: true },
  
  amount: { type: Number },

  deliveryAgent: { type: Number, required: false },
  deliveryStatus: { type: Number }, //1-assigned 2-picked up  3-delivered
  
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
