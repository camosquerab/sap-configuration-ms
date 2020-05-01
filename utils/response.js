'use strict';

const STATUS_CODES = require('./constants');

const success = (res, status, data) => {
    return res.status(status).send(data);
}

const emptySuccess = (res, status = STATUS_CODES.OK) => {
    return res.status(status).send();
}

const error = (res, status, message) => {
    return res.status(status).send({ error: message });
} 

module.exports = {
    success,
    emptySuccess,
    error
}