const userModel = require('../../../models/user.model');
const jwt = require('jsonwebtoken');
const { EXPIRES_IN_THIRTY_SECONDS } = require('./constants/tokenExpiration');

const usersDB = {
	users: require('../../../models/fixtures/users.json'),
	setUsers(data) {
		this.users = data;
	},
};
/**
 * If the user has a valid refresh token, then we'll send them a new access token
 * @param req - The request object.
 * @param res - The response object.
 * @returns The access token is being returned.
 */

const handleRefreshToken = async (req, res) => {
	const cookies = req.cookies;

	if (!cookies?.jwt) return res.sendStatus(401);

	const refreshToken = cookies.jwt;

	// Not every mongoose methods needs the exec() data model, but this in particular does
	// that is because we could pass in a callback afterward like error result for example.
	// If you don't do that and you are using the async/await, then you need to put exec()
	// at the end of findOne()
	// src: https://mongoosejs.com/docs/async-await.html#queries
	const foundUser = await userModel.findOne({ refreshToken }).exec();

	// Forbidden status code
	if (!foundUser) return res.sendStatus(403);

	// evaluate JWT
	jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
		if (err || foundUser.username !== decoded.username) {
			return res.sendStatus(403);
		}

		const roles = Object.values(foundUser.roles);

		const accessToken = jwt.sign(
			{
				userInfo: {
					username: decoded.username,
					roles: roles,
				},
			},
			process.env.ACCESS_TOKEN_SECRET,
			{
				expiresIn: EXPIRES_IN_THIRTY_SECONDS,
			}
		);

		res.json({ accessToken });
	});
};

module.exports = { handleRefreshToken };
