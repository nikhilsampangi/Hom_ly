const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstname: {type:String, required:[true, 'firstname cannot be empty']},
    
    lastname: {type:String, required:[true, 'lastname cannot be empty']},

    hashedPassword: {type:String, required:[true, 'Password cannot be empty']},

    email: {type:String, required: [true, 'email cannot be empty'],

        validate: {
            validator: function(v) {
                var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                return re.test(v)
            },
            message: 'Please fill a valid email address'
        }

    },

    isVerified: {type:Boolean, default: false},
    
    token: {type:String, default: null},    

    passwordResetToken: {type:String, default:null},
});

UserSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("User", UserSchema);
