'use strict';

const Joi = require('@hapi/joi');

const room = Joi.object({
    id: Joi.string(),
    owner: Joi.object({ id: Joi.number().integer().positive().required() }).required(),
    canvas: Joi.object({ id: Joi.number().integer().positive().required() }).required(),
    chat: Joi.object({ id: Joi.number().integer().positive().required() }).required(),
    name: Joi.string().min(3).max(50).trim().required(),
    capacity: Joi.number().integer().positive().required(),
    players: Joi.object({ list: Joi.array().items(Joi.number().integer().positive()) }),
    password: Joi.string().min(3).max(15).required(),
    type: Joi.string().valid('Public', 'Private').required(),
    topic: Joi.object({ id: Joi.number().integer().positive().required() }).required()
});

module.exports = room; 