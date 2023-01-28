// Cross Origins Resource Sharing
const WHITE_LISTS = ['https://www.yoursite.com', 'http://localhost:3500'];

const corsOptions = {
	origin: (origin, callback) => {
		if (WHITE_LISTS.indexOf(origin) !== -1 || !origin) {
			callback(null, true);
		} else {
			callback(new Error('❌ Not Allowed By CORS'));
		}
	},
	optionsSuccessStatus: 200,
};

module.exports = corsOptions;
