const userModel = require('../../../../models/user.model');

const findUser = (user) => {
	return userModel.findOne({ username: user }).exec();
};

const findUserRefreshToken = (refreshToken) => {
	return userModel.findOne({ refreshToken }).exec();
};

const invalidateUserToken = async (err, decoded) => {
	if (err) return res.sendStatus(403);

	const hackedUser = await findUser(decoded.username);

	hackedUser.refreshToken = [];

	await hackedUser.save();
};

module.exports = { findUser, findUserRefreshToken, invalidateUserToken };
