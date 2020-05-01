'use strict';

const express = require('express');
const router = express.Router();
const healthcheck = require('../controllers/v1/healthcheck');

router.get('/healthcheck', healthcheck.ok);

module.exports = router;