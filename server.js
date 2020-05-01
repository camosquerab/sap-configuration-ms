'use strict';

const express = require('express');
const app = express();
const database = require('./db/connection');

// middleware
app.use(express.json());

// import routes
const healthcheck = require('./routes/healthcheck');
const room = require('./routes/room');

// implement routes
app.use('/api/v1', healthcheck);
app.use('/api/v1/rooms', room);

// connect mongoDB database
database.connect();

// start sever
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`listening on port: ${PORT}`);
});

module.exports = { server }