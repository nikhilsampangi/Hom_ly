const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
  custId: { type: String, required: true },

  chefId: { type: String, required: true },
  
  transactionId: {type:String, default: null},
  
  status: {type:String, enum:['initiated','completed','failed'], required:true},

  referenceId: {type: String, default: null},

  modeOfPayment: {type:String, default: null},

  bankName: {type: String, default: null},
  
  createdAt: {type:Date, default: Date.now},
  
  updatedAt: {type:Date, default: Date.now}, 
  
  amount: { type: Number, default:null},
  
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
