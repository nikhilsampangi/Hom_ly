const Joi = require('@hapi/joi');

const validationSchema = Joi.object({

    firstName: Joi.string()
        .min(3)
        .max(30)
        .required()
        .error(new Error('firstname should be 3-30 characters')),
    
    lastName: Joi.string()
        .min(3)
        .max(30)
        .required()
        .error(new Error('lastname should be 3-30 characters')),    

    
    internalAuth:{
        
        hashedPassword: Joi.string()
            .pattern(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
            .required()
            .error(new Error('password should be of length 8 and should contain atleast one digit one lowercase or uppercase and one special character')),
        
        phoneNum: Joi.string()
            .pattern(/^\d{10}$/).required()
            .error(new Error('phone number should be 10 digits')),
        
        passwordResetToken: Joi.string()
    },

    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    
});

module.exports = validationSchema;