const jwt = require('jsonwebtoken');

const generateJwtToken = (payload = {}, secretKey, option = {}) => {
	if (!Object.keys(payload).length) {
		throw new Error('❌ The payload of jwt token is missing!');
	}

	if (secretKey === '') {
		throw new Error('❌ Missing secret key to generate JWT Token!');
	}

	return jwt.sign(payload, secretKey, option);
};

const invalidateOldUserRefreshToken = (foundUser, oldRefreshToken) => {
	return foundUser.filter((currentRefreshToken) => {
		return currentRefreshToken !== oldRefreshToken;
	});
};

module.exports = { generateJwtToken, invalidateOldUserRefreshToken };
