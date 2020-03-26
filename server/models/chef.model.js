const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ChefSchema = new Schema({
  firstName: { type: String, required: [true, "firstname cannot be empty"] },

  lastName: { type: String },

  hashedPassword: {
    type: String,
    required: [true, "Password cannot be empty"]
  },

  passwordResetToken: { type: String, default: null },

  isRegistered: {type: Boolean, default: false},

  isValidated: {type: Boolean, default: false},

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

  bio: {
    type: String,
    default: "Noob"
  },

  expertiseLevel: {
    type: String,
    enum: ["Freelancer", "CIO Certified Chef"],
    default: "Freelancer"
  },

  menu: [
    {
      itemName: { type: String, required: true },
      itemDescr: { type: String },
      itemCost: { type: Number },
      // Need to add food items photo
      isVeg: { type: Boolean, default: true }
    }
  ]
  //   Need to add: Address, Profile photo
});

ChefSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("chefs", ChefSchema);
