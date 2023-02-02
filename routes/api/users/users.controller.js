const userModel = require('../../../models/user.model');
const bcrypt = require('bcrypt');

const createNewUser = async (req, res) => {
	const { user, password } = req.body;

	if (!user || !password) {
		return res.status(400).json({
			error: 'Username and password are required!',
		});
	}

	// Not every mongoose methods needs the exec() data model, but this in particular does
	// that is because we could pass in a callback afterward like error result for example.
	// If you don't do that and you are using the async/await, then you need to put exec()
	// at the end of findOne()
	// src: https://mongoosejs.com/docs/async-await.html#queries
	const isDuplicateUser = await userModel.findOne({ username: user }).exec();

	if (isDuplicateUser) {
		// 409 = conflict HTTP status code
		res.status(409).json({
			error: `username ${user} exist`,
		});
	}

	try {
		// encrypt the password by hashing and salting.
		const hashedPassword = await bcrypt.hash(password, 10);

		// create and store the new user on Mongoose all at once
		const storeUser = await userModel.create({
			username: user,
			password: hashedPassword,
		});

		console.log(storeUser);

		res.status(201).json({
			success: `New User ${user} created`,
		});
	} catch (error) {
		res.status(500).json({
			error: error.message,
		});
	}
};

const getAllUsers = (req, res) => {
	res.status(200).json(usersDB.users);
};

module.exports = { createNewUser, getAllUsers };
