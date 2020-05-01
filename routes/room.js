'use strict';

const express = require('express');
const router = express.Router();
const room = require('../controllers/v1/room');
const validator = require('../middleware/validator');

router.post(
    '/',
    validator.body(
        room.validator, 'room',
        [
            'owner.id', 'canvas.id', 'chat.id', 'capacity',
            'name', 'password', 'type', 'topic'
        ]
    ),
    room.create
);

router.get(
    '/:id(\\d+)',
    room.find
);

router.put(
    '/:idRoom(\\d+)/join/:idUser(\\d+)',
    validator.body(
        room.validatorUpdate, 'access',
        ['password']
    ),
    room.join
);

router.delete(
    '/:idRoom(\\d+)/disjoin/:idUser(\\d+)',
    room.disjoin
);

module.exports = router;