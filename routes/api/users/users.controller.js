const fsPromises = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');

const usersDB = {
	users: require('../../../models/users.json'),
	setUsers(data) {
		this.users = data;
	},
};

const createNewUser = async (req, res) => {
	const { user, password } = req.body;

	if (!user || !password) {
		return res.status(400).json({
			error: 'Username and password are required!',
		});
	}

	// Check for duplicated username in the Database
	const isDuplicateUser = usersDB.users.find((person) => person.username === user);

	if (isDuplicateUser) {
		// 409 = conflict HTTP status code
		res.status(409).json({
			error: `username ${user} exist`,
		});
	}

	try {
		// encrypt the password by hasing and salting.
		const hashedPassword = await bcrypt.hash(password, 10);

		// store the new user
		const newUser = {
			username: user,
			roles: {
				user: 2001,
			},
			password: hashedPassword,
		};

		usersDB.setUsers([...usersDB.users, newUser]);

		const usersJson = path.join(__dirname, '..', '..', '..', 'models', 'users.json');
		await fsPromises.writeFile(usersJson, JSON.stringify(usersDB.users));

		res.status(201).json({
			success: `New User ${user} created`,
		});
	} catch (error) {
		res.status(500).json({
			error: error.message,
		});
	}
};

module.exports = { createNewUser };
