const jwt = require('jsonwebtoken');
require('dotenv').config();

const usersDB = {
	users: require('../../../models/users.json'),
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

const handleRefreshToken = (req, res) => {
	const cookies = req.cookies;

	if (!cookies?.jwt) return res.sendStatus(401);

	const refreshToken = cookies.jwt;
	const foundUser = usersDB.users.find((person) => person.refreshToken === refreshToken);

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
				expiresIn: '2s',
			}
		);

		res.json({ roles, accessToken });
	});
};

module.exports = { handleRefreshToken };
