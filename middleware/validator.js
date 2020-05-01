'use strict';

const _ = {
    ...require('lodash/object'),
    ...require('lodash/lang')
}

const response = require('../utils/response');
const STATUS_CODES = require('../utils/constants');

const body = (validator, type, values, isUpdate = false) => {
    return (req, res, next) => {
        if (!req.body[type])
            return response.error(res, STATUS_CODES.BAD_REQUEST, `wrong header tag!`);

        const data = _.pick(req.body[type], values);
        const { value, error } = validator(data, isUpdate);

        if (error)
            return response.error(res, STATUS_CODES.BAD_REQUEST, error.message);

        if (_.isEmpty(value))
            return response.error(res, STATUS_CODES.BAD_REQUEST, 'there are no valid attributes!');

        req.body = value;
        const date = new Date();

        if (!isUpdate)
            req.body.createdAt = date;

        req.body.updatedAt = date;
        next();
    }
}

const query = (validator) => {
    return (req, res, next) => {
        const { error } = validator(req.query);

        if (error)
            return response.error(res, STATUS_CODES.BAD_REQUEST, `request query ${error.message}`);

        next();
    }
}

module.exports = {
    body,
    query
}