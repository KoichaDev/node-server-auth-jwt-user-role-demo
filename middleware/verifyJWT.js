const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJWT = (req, res, next) => {
	const authHeader = req.headers['authorization'];
	// 401 = unauthorized

	if (!authHeader) return res.status(401);

	console.log(authHeader); // Bearer token
	const token = authHeader.split(' ')[1];
	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
		if (err) {
			// We know we will receive the token, but something about it wasn't right,
			// in other words, it may have been tampered with, and that means
			// we have an invalid token. Sending 403 means you are forbidden to access to this
			return res.sendStatus(403);
		}

		// This is being decoded and we can read the username
		req.user = decoded.username;
		next();
	});
};

module.exports = verifyJWT;
