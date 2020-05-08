const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ChefSchema = new Schema({
  
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

  currentPosition: {
    latitude: {type: Number},
    longitude: {type: Number}
  },

  Address: [
    {
      Localty: { type: String },
      City: { type: String },
      State: { type: String },
      Pincode: { type: String },
    },
  ],

  bio: {
    type: String,
    default: "Not Specified",
  },
  specialities: {
    type: String,
    default: "Not Specified",
  },

  expertiseLevel: {
    type: Boolean,
    default: false,
  },

  workingStatus: {
    type: Boolean,
    default: false,
  },

  menu: [
    {
      itemName: { type: String, required: true },
      itemDescr: { type: String },
      itemCost: { type: Number, required: true },
      // Need to add food items photo
      isVeg: { type: Boolean, required: true },
    },
  ],

  // rating: { type: Number, default: 0 },

  // feedbacks: [
  //   {
  //     date: { type: Date, default: Date.now, required: true },
  //     content: { type: String, default: "No Feedback given", required: true },
  //   },
  // ],
  //   Need to add: Address, Profile photo
});

ChefSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("chefs", ChefSchema);
