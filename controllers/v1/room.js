'use strict';

const response = require('../../utils/response');
const STATUS_CODES = require('../../utils/constants');
const database = require('../../db/connection');
const room = require('../../db/entities/room');
const _join = require('../../db/entities/join');
const { flattenObject } = require('../../utils/tools');

const create = async (req, res, next) => {
    try {
        const db = await database.connect();
        let id = await db.collection('counters').findOneAndUpdate({ _id: 'rooms' }, { $inc: { sequenceValue: 1 } });

        if (id)
            if (id.lastErrorObject.n == 0) {
                await db.collection('counters').insertOne({ _id: 'rooms', sequenceValue: 2 });
                id = 1;
            }

            else
                id = id.value.sequenceValue;

        req.body.id = id;
        req.body.players = { list: [req.body.owner.id] }
        await db.collection('rooms').insertOne(req.body);
        return response.success(res, STATUS_CODES.CREATED, { id: id });
    }

    catch (error) {
        return response.error(res, STATUS_CODES.INTERNAL_SERVER, error.message);
    }
}

const find = async (req, res, next) => {
    try {
        const db = await database.connect();
        const room = await db.collection('rooms').findOne(
            { id: parseInt(req.params.id) },
            { projection: { _id: 0, id: 0, password: 0, createdAt: 0, updatedAt: 0 } }
        );

        if (!room)
            return response.error(res, STATUS_CODES.NOT_FOUND, 'room not found');

        room.players.number = room.players.list.length;
        return response.success(res, STATUS_CODES.OK, room);
    }

    catch (error) {
        return response.error(res, STATUS_CODES.INTERNAL_SERVER, error.message);
    }
}

const join = async (req, res, next) => {
    try {
        const db = await database.connect();
        const number = await db.collection('rooms').findOne(
            { id: parseInt(req.params.idRoom) },
            { projection: { capacity: 1, "players.list": 1 } }
        );

        if (!number)
            return response.error(res, STATUS_CODES.NOT_FOUND, 'room not found');

        if (number.players.list.length == number.capacity)
            return response.error(res, STATUS_CODES.UNAUTHORIZED, 'room is full');

        const room = await db.collection('rooms').updateOne(
            { id: parseInt(req.params.idRoom), password: req.body.password },
            {
                $set: flattenObject(req.body),
                $addToSet: { 'players.list': parseInt(req.params.idUser) }
            }
        );

        if (room.result.n == 0)
            return response.error(res, STATUS_CODES.NOT_FOUND, 'room not found or wrong password');

        return response.success(res, STATUS_CODES.OK, 'Connected');
    }

    catch (error) {
        return response.error(res, STATUS_CODES.INTERNAL_SERVER, error.message);
    }
}

const disjoin = async (req, res, next) => {
    try {
        const db = await database.connect();

        const room = await db.collection('rooms').updateOne(
            { id: parseInt(req.params.idRoom) },
            { $pull: { 'players.list': parseInt(req.params.idUser) } }
        );

        if (room.result.n == 0)
            return response.error(res, STATUS_CODES.NOT_FOUND, 'room not found');

        return response.success(res, STATUS_CODES.OK, 'disconnected');
    }

    catch (error) {
        return response.error(res, STATUS_CODES.INTERNAL_SERVER, error.message);
    }
}

const validator = (_room) => {
    return room.validate(_room);
}

const validatorUpdate = (__join) => {
    return _join.validate(__join);
}

module.exports = {
    create,
    find,
    join,
    disjoin,
    validator,
    validatorUpdate
};