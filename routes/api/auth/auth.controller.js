const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fsPromises = require('fs').promises;
const path = require('path');

const usersDB = {
	users: require('../../../models/users.json'),
	setUsers(data) {
		this.users = data;
	},
};

const pathToUsersJson = path.join(__dirname, '..', '..', '..', 'models', 'users.json');

const handleLogin = async (req, res) => {
	const { user, password } = req.body;

	console.log(req.body);
	if (!user || !password) {
		return res.status(400).json({
			error: 'Username and password are required!',
		});
	}

	const foundUser = usersDB.users.find((person) => person.username === user);

	// Unauthorized status code
	if (!foundUser) return res.sendStatus(401);

	// evaluate password
	const isMatchedPassword = await bcrypt.compare(password, foundUser.password);

	if (isMatchedPassword) {
		const roles = Object.values(foundUser.roles).filter(Boolean);

		// We are are creating JWTs
		// Just pass in username, and not password. Passing password would hurt your security
		const accessToken = jwt.sign(
			{
				userInfo: {
					username: foundUser.username,
					roles: roles,
				},
			},
			process.env.ACCESS_TOKEN_SECRET,
			{
				expiresIn: '2s',
			}
		);

		const refreshToken = jwt.sign(
			{
				username: foundUser.username,
			},
			process.env.REFRESH_TOKEN_SECRET,
			{
				expiresIn: '1d',
			}
		);

		// We want to save our refreshToken in DB, which will also allows us to create a logout
		// in the future that will allows us to invalidate the refresh token when a user
		// logs out. We will saving refresh token with current user
		const otherUsers = usersDB.users.filter((person) => person.username !== foundUser.username);
		const currentUser = { ...foundUser, refreshToken };

		usersDB.setUsers([...otherUsers, currentUser]);

		await fsPromises.writeFile(pathToUsersJson, JSON.stringify(usersDB.users));

		const EXPIRES_IN_ONE_DAY = 24 * 60 * 60 * 1000;
		const cookieOptions = {
			httpOnly: true, // this is to be not available to Javascript
			// secure: process.env.NODE === 'production' ? true : false,
			// sameSite: process.env.NODE === 'production' ? 'None' : 'Lax',
			maxAge: EXPIRES_IN_ONE_DAY,
		};

		// ! Cookie is not available to JavaScript and while it is not 100% secure, but it is much
		// ! more secure than storing your refresh token in local Storage or in another cookie
		// ! that is available

		res.cookie('jwt', refreshToken, cookieOptions);
		res.json({ roles, accessToken });
	} else {
		res.status(401);
	}
};

const handleLogout = async (req, res) => {
	// TODO: on Client, also delete the access token
	const cookies = req.cookies;

	// status 204 =  No Content to send back
	if (!cookies?.jwt) return res.sendStatus(204);

	const refreshToken = cookies.jwt;
	// Is refreshToken in DB
	const foundUser = usersDB.users.find((person) => person.refreshToken === refreshToken);

	// Forbidden status code
	if (!foundUser) {
		res.clearCookie('jwt', {
			httpOnly: true,
			// secure: process.env.NODE === 'production' ? true : false,
			// sameSite: process.env.NODE === 'production' ? 'None' : 'Lax',
		});
		return res.sendStatus(204);
	}

	// Delete the refresh token in DB
	const otherUsers = usersDB.users.filter((person) => person.refreshToken !== foundUser);
	const currentUser = { ...foundUser, refreshToken: '' };
	usersDB.setUsers([...otherUsers, currentUser]);

	await fsPromises.writeFile(pathToUsersJson, JSON.stringify(usersDB.users));

	res.clearCookie('jwt', {
		httpOnly: true,
		// secure: process.env.NODE === 'production' ? true : false,
		// sameSite: process.env.NODE === 'production' ? 'None' : 'Lax',
	});

	res.sendStatus(204);
};

module.exports = { handleLogin, handleLogout };
