const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
  firstName: { type: String, required: [true, "firstname cannot be empty"] },

  lastName: { type: String },

  hashedPassword: {
    type: String,
    required: [true, "Password cannot be empty"]
  },

  passwordResetToken: { type: String, default: null },

  isRegistered: {type: Boolean, default: false},

  email: {
    type: String,
    required: [true, "email cannot be empty"],
    validate: {
      validator: function(v) {
        var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return re.test(v);
      },
      message: "Please fill a valid email address"
    }
  },

  phoneNum: {
    type: Number,
    required: [true, "Phone number cannot be empty"],
    validate: {
      validator: function(v) {
        var re = /^\d{10}$/;
        return re.test(v);
      },
      message: "Phone number must be 10 digit number"
    }
  },

  favChef: [
    {
      chefId: { type: Number, required: true }
    }
  ],

  balance: { type: String, default: "0.00" },

  isHotel: { type: Boolean, default: false },

  isVeg: { type: Boolean, default: false },

  contracts: [
    {
      contrTitle: { type: String, require: true },
      contrDescription: { type: String },
      contrStatus: { type: Number, default: 0 }
      //   plan to use contrStatus field to store chef id when contract gets taken
    }
  ]
  //   Need to add: Address, Profile photo
});

CustomerSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("customer", CustomerSchema);
