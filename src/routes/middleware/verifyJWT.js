const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
	const authHeader = req.headers.authorization || req.headers.Authorization;

	// 401 = unauthorized
	if (!authHeader?.startsWith('Bearer ')) {
		return res.sendStatus(401);
	}

	const token = authHeader.split(' ')[1];

	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
		console.log(err);
		// We know we will receive the token, but something about it wasn't right,
		// in other words, it may have been tampered with, and that means
		// we have an invalid token. Sending 403 means you are forbidden to access to this
		if (err) {
			return res.sendStatus(403);
		}
		// This is being decoded and we can read the username
		req.user = decoded.userInfo.username;
		req.roles = decoded.userInfo.roles;
		next();
	});
};

module.exports = verifyJWT;
