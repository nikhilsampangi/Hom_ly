const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ValidationRequest = new Schema({
  chefId: { type: String, required: true},
  dishId: { type: String, required: true},
  date: { type: Date, required: true},
  reply:  { type: Number, default: 0},
});

const DishReport = new Schema({
  chefId : {type: String, required: true},
  response : {type: Number, default: 0, required: true},
  rating : {type: Number, required: true},
  remarks: {type: String, reequired: true},
});

const MenuSchema = new Schema({
    itemName: { type: String, required: [true, 'Enter dish name'], unique: [true, 'This dish name already exsists.'] },
    itemDescr: { type: String, required: [true, 'dish descreption required'] },
    itemRecpie: { type: String, required: [true, 'dish recipie is required']},
    itemCost: { type: Number, required: [true, 'dish cost required'] },
    dishPic: { type: String,  required: [true, 'dish pic required']},
    isVeg: { type: Boolean, default: true , required: true},

    newDish: { type: Number, required: true},
    request_status: { type: String}, 
    validated: {type: Number, default: 0, required: true},
    dishReport: [DishReport],

    categorey: {type: Number, default: 4, required: true}, // to sort

    forToday: {type: Number, default: 0}, 
});

const ChefSchema = new Schema({
  firstName: { type: String, required: [true, "firstname cannot be empty"] },

  lastName: { type: String },

  hashedPassword: {
    type: String,
    required: [true, "Password cannot be empty"],
  },

  passwordResetToken: { type: String, default: null },

  isRegistered: { type: Boolean, default: false },

  isValidated: { type: Boolean, default: false },

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

  phoneNum: {
    type: Number,
    required: [true, "Phone number cannot be empty"],
    validate: {
      validator: function (v) {
        var re = /^\d{10}$/;
        return re.test(v);
      },
      message: "Phone number must be 10 digit number",
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
      isVeg: { type: Boolean, required: true },
      dishPic: { type: String,  required: [true, 'dish pic required']},
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
MenuSchema.set("toJSON", { virtuals: true });
ValidationRequest.set("toJSON", { virtuals: true });
DishReport.set("toJSON", { virtuals: true });

module.exports = {
  Chef: mongoose.model("chefs", ChefSchema),
  Menu : mongoose.model("Menu", MenuSchema),
  ValidationRequest : mongoose.model("ValidationRequest", ValidationRequest),
  DishReport : mongoose.model("DishReport", DishReport),
}
