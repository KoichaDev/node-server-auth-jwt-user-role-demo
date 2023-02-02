const { ALLOWED_ORIGINS } = require('./constants/allowedOrigins.js');

const corsConfig = {
	origin: (origin, callback) => {
		if (ALLOWED_ORIGINS.indexOf(origin) !== -1 || !origin) {
			callback(null, true);
		} else {
			callback(new Error('❌ Not Allowed By CORS'));
		}
	},
	optionsSuccessStatus: 200,
};

module.exports = corsConfig;
