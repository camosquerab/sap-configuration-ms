'use strict';

const response = require('../../utils/response');
const STATUS_CODES = require('../../utils/constants');

const ok = (req, res, next) => {
    return response.success(res, STATUS_CODES.OK, { status: "ok" });
}

module.exports = { ok };