const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DeliveryManSchema = new Schema({
  firstName: { type: String, },

  lastName: { type: String, },

  hashedPassword: {type: String, },

  passwordResetToken: { type: String, default: null },

  isRegistered: {type: Boolean, default: false},

  isValidated: {type: Boolean, default: false},
  
  drivingLicense: {type: String, required: [false, "Driving License is mandatory!!!"]},
<<<<<<< HEAD

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
=======
>>>>>>> 58b5619f686d2b1cb631d2923bfbad8b46fcb438

  email: {type: String, required: [true, "email cannot be empty"]},

  phoneNum: {type: Number, required: [true, "Phone number cannot be empty"]},

  earnings: {
    type: Number
  },

  // maxOrders: {type: Number, default: 0},
  // orders: [
  //   {
  //     customerId: {},
  //     dishId: {},
  //     status: {type: Number, default: 0},//0- not pickedup, 1-picked up, 2-delivered
  //     orderTime: {},
  //     estimatedTime: {type: Number} //in mins
  //   },
  // ]
});

DeliveryManSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("deliveryAgents", DeliveryManSchema);