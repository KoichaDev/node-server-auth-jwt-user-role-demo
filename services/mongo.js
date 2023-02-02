const mongoose = require('mongoose');
const express = require('express');
require('dotenv').config();

const mongo = express();
/**
 * In strict query mode, Mongoose will only return fields that have been explicitly defined in your schema,
 * even if the fields exist in the underlying MongoDB document. By setting strictQuery to false,
 * Mongoose will return all fields in the MongoDB document,
 * even if they are not defined in the schema. This can make querying faster, but it can also result in unexpected data being returned if fields are added or changed in the MongoDB document.
 */
mongoose.set('strictQuery', false);

// using once() allows this event 'open' to only trigger our callback once the first time it is executed
// We are just being explicit that the open event will only get triggered once.
mongoose.connection.once('open', () => console.log('⚡️ Connected to Mongo DB'));

// using the on() function is because we never know when an error will get triggered
mongoose.connection.on('error', (err) => console.error(`❌ ${err}`));

const connectMongoDB = async () => {
	try {
		const MONGO_URI = process.env.DATABASE_URI;

		await mongoose.connect(MONGO_URI, {
			useUnifiedTopology: true,
			useNewUrlParser: true,
		});
	} catch (error) {
		console.log('❌', error);
	}
};

const disconnectMongoDB = async () => {
	try {
		await mongoose.disconnect();
	} catch (error) {
		console.log('❌', error);
	}
};

const startServer = async () => {
	const PORT = process.env.PORT || 3500;

	await connectMongoDB();

	await mongo.listen(PORT, () => {
		console.log(`🚀 Server is running on port ${PORT}`);
	});
};

module.exports = { connectMongoDB, disconnectMongoDB, startServer };
