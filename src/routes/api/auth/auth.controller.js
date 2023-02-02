const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userModel = require('../../../models/user.model');
const { EXPIRES_IN_THIRTY_SECONDS, EXPIRES_IN_ONE_DAY } = require('./constants/tokenExpiration');

const handleLogin = async (req, res) => {
	const { user, password } = req.body;

	if (!user || !password) {
		return res.status(400).json({
			error: 'Username and password are required!',
		});
	}

	const foundUser = await userModel.findOne({ username: user }).exec();

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
				expiresIn: EXPIRES_IN_THIRTY_SECONDS,
			}
		);

		const refreshToken = jwt.sign(
			{
				username: foundUser.username,
			},
			process.env.REFRESH_TOKEN_SECRET,
			{
				expiresIn: EXPIRES_IN_ONE_DAY,
			}
		);

		// We want to save our refreshToken in DB, which will also allows us to create a logout
		// in the future that will allows us to invalidate the refresh token when a user
		// logs out. We will saving refresh token with current user
		foundUser.refreshToken = refreshToken;
		const result = await foundUser.save();

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
	const foundUser = await userModel.findOne({ refreshToken }).exec();

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

	foundUser.refreshToken = '';
	// This will save to the mongoDB document that is stored in the user colletion
	const result = await foundUser.save();

	res.clearCookie('jwt', {
		httpOnly: true,
		// secure: process.env.NODE === 'production' ? true : false,
		// sameSite: process.env.NODE === 'production' ? 'None' : 'Lax',
	});

	res.sendStatus(204);
};

module.exports = { handleLogin, handleLogout };
