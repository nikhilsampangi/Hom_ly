const Joi = require('@hapi/joi');

const passwordSchema = Joi.object({
    
    password: Joi.string()
        .pattern(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
        .required()
        .error(new Error('password should be of length 8 and should contain atleast one digit one lowercase or uppercase and one special character')),

});

module.exports = passwordSchema;