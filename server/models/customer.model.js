const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chatSchema = new Schema({
  time: { type: Date, default: Date.now },
  text: { type: String },
  flag: { type: Number }, // to differentiate between sent and recived messages
})

const chefRequestSchema = new Schema({
  chefId: { type: String, required: true },
  // chatting schema
  roomId: { type: String },
  messages: [ chatSchema ],
  chefStatus: { type: Number, default: 0 }, // in-touch, accepted , rejected
})

const contractSchema = new Schema({
    date: { type: Date, default: Date.now, required: true },
    deliveryDate: { type: Date, required: true },
    contrTitle: { type: String, require: true },
    contrType: { type: Number, default: 0, required: true }, // work from home, work at hotel, work at customer's house
    contrDescription: { type: String },
    contrStatus: { type: Number, default: 0 }, //0- initiated 1-approved 2-delivered
    chefs: [ chefRequestSchema ],
})

const CustomerSchema = new Schema({
  
  firstName: { type: String, required: [true, "firstname cannot be empty"] },

  lastName: { type: String },

  isVerified: {type: Boolean, default: false},

  isValidated: {type: Boolean, default: false},

  internalAuth:{
      
    hashedPassword: {
      type: String,
      default: null
      // required: [true, "Password cannot be empty"]
    }, 

    passwordResetToken: { type: String, default: null },

    phoneNum: {
      type: Number,
      default: null
      // required: [true, "Phone number cannot be empty"],
      // validate: {
      //   validator: function(v) {
      //     var re = /^\d{10}$/;
      //     return re.test(v);
      //   },
      //   message: "Phone number must be 10 digit number"
      // }
    }

},

googleOAuth: {
  
  gid: {type: String, default: null},
  
  name: {type: String, default: null},

  isRegistered: { type: Boolean, default: false },

},

  email: {
    type: String,
    required: [true, "email cannot be empty"],
    validate: {
      validator: function (v) {
        var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return re.test(v);
      },
      message: "Please fill a valid email address",
    },
  },

  Address: [
    {
      Localty: { type: String },
      City: { type: String },
      State: { type: String },
      Pincode: { type: String },
    },
  ],

  favChef: [
    {
      chefId: { type: Number, required: true },
    },
  ],

  balance: { type: String, default: "0.00" },

  isHotel: { type: Boolean, default: false },

  isVeg: { type: Boolean, default: false },

  contracts: [ contractSchema ],

  //   Need to add:  Profile photo
});

CustomerSchema.set("toJSON", { virtuals: true });
contractSchema.set("toJSON", { virtuals: true });

// module.exports = mongoose.model("customer", CustomerSchema);

module.exports = {
  User: mongoose.model("customer", CustomerSchema),
  contract: mongoose.model("contract", contractSchema),
  chefRequest: mongoose.model("chefRequest", chefRequestSchema),
  chat: mongoose.model("chat", chatSchema),
}
