'use strict';

const { MongoClient, ObjectId } = require('mongodb');

const _connect = async () => {
	try {
		const client = new MongoClient(
			'mongodb://sap-configuration-db:27017',
			//'mongodb://localhost:27017',
			{ useUnifiedTopology: true }
		);

		await client.connect();
		const db = client.db('sap-configuration-db');
		console.log('Connected to mongoDB');
		return db;
	}

	catch (error) {
		console.log(`Could not connect to mongoDB...\n${error}`);
		process.exit(1);
	}
}

const namespace = {
	getSingleton: (() => {
		let singleton;
		return () => {
			if (!singleton) {
				const db = _connect();
				singleton = {
					connect: async () => {
						return await db;
					}
				}
			}
			return singleton;
		};
	})()
};

Object.freeze(namespace);

const connect = () => {
	return namespace.getSingleton().connect();
}

module.exports = {
	db: connect,
	connect: connect,
	ObjectId
}