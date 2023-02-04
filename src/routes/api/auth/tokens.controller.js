const jwt = require('jsonwebtoken');
const { cookieOption } = require('./constants/cookies/cookieOptions');
const { generateJwtToken } = require('./helpers/tokenUtils');
const { findUserRefreshToken, invalidateUserToken } = require('./services/userModel.services');
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = require('./constants/tokens/tokenSecret');

/**
 * If the user has a valid refresh token, then we'll send them a new access token
 * @param req - The request object.
 * @param res - The response object.
 * @returns The access token is being returned.
 */

const handleRefreshToken = async (req, res) => {
	const requestCookies = req.cookies;
	if (!requestCookies?.jwt) return res.sendStatus(401);

	// ! We want to delete after we receive cookie, because we are going to get a new cookie
	// clearCookie(res);
	res.clearCookie('jwt', cookieOption);

	const refreshToken = requestCookies.jwt;

	// Not every mongoose methods needs the exec() data model, but this in particular does
	// that is because we could pass in a callback afterward like error result for example.
	// If you don't do that and you are using the async/await, then you need to put exec()
	// at the end of findOne()
	// src: https://mongoosejs.com/docs/async-await.html#queries
	const foundUser = await findUserRefreshToken(refreshToken);

	// Detect refresh token reuse by malicious hacker!
	if (!foundUser) {
		jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, invalidateUserToken);

		return res.sendStatus(403);
	}

	const newRefreshTokenArray = foundUser.refreshToken.filter((rt) => rt !== refreshToken);

	// evaluate JWT
	jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, async (err, decoded) => {
		// we will receive the token, but at the same time it has expired that is being replaced
		// we need to update our data in the database
		if (err) {
			foundUser.refreshToken = [...newRefreshTokenArray];
			await foundUser.save();
		}

		/* It's checking if the user is the same user that is trying to refresh the token. */
		if (err || foundUser.username !== decoded.username) {
			return res.sendStatus(403);
		}

		// refresh token here is still valid
		const roles = Object.values(foundUser.roles);

		const payloadAccessToken = {
			userInfo: {
				username: foundUser.username,
				roles: roles,
			},
		};

		const payloadRefreshToken = {
			username: foundUser.username,
		};

		const accessToken = generateJwtToken(payloadAccessToken, ACCESS_TOKEN_SECRET, {
			expiresIn: '10s',
		});

		// The refresh token is where it will let the user to be valid by logging in X amount of "expiresIn"
		// if it expires, it will logout completely whereas the access Token can re-created each new time.
		// It's just the access token  will be valid until the refresh token is done.
		const newRefreshToken = generateJwtToken(payloadRefreshToken, REFRESH_TOKEN_SECRET, {
			expiresIn: '1d',
		});

		// We want to save our refreshToken in DB, which will also allows us to create a logout
		// in the future that will allows us to invalidate the refresh token when a user
		// logs out. We will saving refresh token with current user
		foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
		await foundUser.save();

		res.cookie('jwt', newRefreshToken, cookieOption);
		res.json({ roles, accessToken });
	});
};

module.exports = { handleRefreshToken };
