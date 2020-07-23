const Joi = require('@hapi/joi');

const deliveryAgentSchema = Joi.object({

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
        
    hashedPassword: Joi.string()
        .pattern(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
        .required()
        .error(new Error('password should be of length 8 and should contain atleast one digit one lowercase or uppercase and one special character')),
    
    phoneNum: Joi.string()
        .pattern(/^\d{10}$/).required()
        .error(new Error('phone number should be 10 digits')),
    
    passwordResetToken: Joi.string(),
<<<<<<< HEAD
    drivingLicense: Joi.string(),

    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
=======

    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'in'] } })
>>>>>>> 58b5619f686d2b1cb631d2923bfbad8b46fcb438
    
});

module.exports = deliveryAgentSchema;