const Joi = require('@hapi/joi');

const customerSchema = Joi.object({

    firstName: Joi.string()
        .min(3)
        .max(30)
        .required(),
    
    lastName: Joi.string()
        .min(3)
        .max(30)
        .required(),    

    
    internalAuth:{
        hashedPassword: Joi.string().required(),
        phoneNum: Joi.string().pattern(/^\d{10}$/).required(),
        passwordResetToken: Joi.string()
    },

    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
});

module.exports = customerSchema;