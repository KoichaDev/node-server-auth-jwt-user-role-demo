const { generateJwtToken, invalidateOldUserRefreshToken } = require('./helpers/tokenUtils');
const { findUser, findUserRefreshToken } = require('./services/userModel.services');
const { isMatchedPassword } = require('./helpers/bcryptUtils');
const { cookieOption } = require('./constants/cookies/cookieOptions');
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = require('./constants/tokens/tokenSecret');
const { EXPIRES_IN_ONE_DAY } = require('./constants/cookies/cookieExpiration');

const handleLogin = async (req, res) => {
	const requestCookies = req.cookies;

	const { user: enteredUsername, password: enteredPassword } = req.body;

	if (!enteredUsername || !enteredPassword) {
		return res.status(400).json({
			error: 'Username and password are required!',
		});
	}

	const foundUser = await findUser(enteredUsername);

	// Unauthorized status code
	if (!foundUser) return res.sendStatus(401);

	// evaluate password
	const passwordIsMatched = isMatchedPassword(enteredUsername, foundUser.password);

	if (!passwordIsMatched) return res.sendStatus(401);

	const roles = Object.values(foundUser.roles).filter(Boolean);

	const jwtPayloadAccessToken = {
		userInfo: {
			username: foundUser.username,
			roles: roles,
		},
	};

	const jwtPayloadNewRefreshToken = {
		username: foundUser.username,
	};

	// It's enough to pass in username, and not password. Passing password would hurt your security!
	const accessToken = generateJwtToken(jwtPayloadAccessToken, ACCESS_TOKEN_SECRET, {
		expiresIn: '10s',
	});
	const newRefreshToken = generateJwtToken(jwtPayloadNewRefreshToken, REFRESH_TOKEN_SECRET, {
		expiresIn: '1d',
	});

	const currentJwtToken = requestCookies?.jwt;
	const currentJwtUserRefreshToken = foundUser.refreshToken;

	/**
	 * Filtering out the refresh token that is in the cookie
	 * from the array of refresh tokens in the database.
	 **/
	const filterRefreshTokenCookie = invalidateOldUserRefreshToken(currentJwtUserRefreshToken, currentJwtToken);

	// We are checking if the new refresh token array is going to be equal what is already on the DB.
	// There were no cookies, no old refresh token to delete out of the DB essentially, but if it's
	// with a jwt, then we want to remove it from the database
	let newRefreshTokenArray = !currentJwtToken ? currentJwtUserRefreshToken : filterRefreshTokenCookie;

	if (requestCookies?.jwt) {
		/**
		 * 1) User logs in but never uses Refresh Token and does not logout
		 * 2) Refresh Token is stolen
		 * 3) if 1 & 2, reuse detection is needed to clear all RTs when user logs in
		 **/
		const refreshToken = requestCookies.jwt;
		const foundToken = await findUserRefreshToken(refreshToken);

		if (!foundToken) {
			newRefreshTokenArray = [];
		}

		res.clearCookie('jwt', cookieOption);
	}
	// We want to save our refreshToken in DB, which will also allows us to create a logout
	// in the future that will allows us to invalidate the refresh token when a user
	// logs out. We will saving refresh token with current user
	foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
	await foundUser.save();

	// ! Cookie is not available to JavaScript and while it is not 100% secure, but it is much
	// ! more secure than storing your refresh token in local Storage or in another cookie
	// ! that is available
	res.cookie('jwt', newRefreshToken, {
		...cookieOption,
		maxAge: EXPIRES_IN_ONE_DAY,
	});

	res.json({ roles, accessToken });
};

const handleLogout = async (req, res) => {
	const requestCookies = req.cookies;

	// status 204 =  No Content to send back
	if (!requestCookies?.jwt) return res.sendStatus(204);

	const refreshToken = requestCookies.jwt;

	// Is refreshToken in DB for the user?
	const foundUser = await findUserRefreshToken(refreshToken);

	// detected the refresh token reuse!
	if (!foundUser) {
		res.clearCookie('jwt', cookieOption);
		return res.sendStatus(204);
	}

	// Delete the refresh token in DB
	foundUser.refreshToken = [];

	// This will save to the mongoDB document that is stored in the user collection
	await foundUser.save();

	res.clearCookie('jwt', cookieOption);
	res.sendStatus(204);
};

module.exports = { handleLogin, handleLogout };
