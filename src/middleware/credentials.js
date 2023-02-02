const { ALLOWED_ORIGINS } = require('../config/constants/allowedOrigins');

// This is a middleware function that is checking the origin of the request
// and if it is in the list of allowed origins,
// it will set the Access-Control-Allow-Credentials header to true.
const credentials = (req, res, next) => {
	const origin = req.headers.origin;

	if (ALLOWED_ORIGINS.includes(origin)) {
		// This is what CORS is looking for the access control allowed credentials
		res.header('Access-Control-Allow-Credentials', true);
	}

	next();
};

module.exports = credentials;
