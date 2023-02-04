const cookieOption = {
	httpOnly: true,
	secure: process.env.NODE === 'production' ? true : false,
	sameSite: process.env.NODE === 'production' ? 'None' : 'Lax',
};

module.exports = { cookieOption };
