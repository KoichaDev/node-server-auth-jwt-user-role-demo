const bcrypt = require('bcrypt');

const usersDB = {
	users: require('../../../models/users.json'),
	setUsers(data) {
		this.users = data;
	},
};

const handleLogin = async (req, res) => {
	const { user, password } = req.body;

	if (!user || !password) {
		return res.status(400).json({
			error: 'Username and password are required!',
		});
	}

	const foundUser = usersDB.users.find((person) => person.username === user);

	if (!foundUser) {
		// Unauthorized status code
		res.status(401).json({
			error: `Unauthorized`,
		});
	}

	// evaluate password
	const isMatchedPassword = await bcrypt.compare(password, foundUser.password);

	if (isMatchedPassword) {
		// TODO: Create JWT
		res.json({
			success: `User ${user} is Logged in!`,
		});
	} else {
		res.status(401);
	}
};

module.exports = { handleLogin };
