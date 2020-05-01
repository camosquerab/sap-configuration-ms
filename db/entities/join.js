const Joi = require('@hapi/joi');

const join = Joi.object({
    password: Joi.string().min(3).max(15),
});

module.exports = join; 