const bcrypt = require('bcrypt');

const isMatchedPassword = (enteredPassword, confirmedPassword) => {
	return bcrypt.compare(enteredPassword, confirmedPassword);
};

module.exports = { isMatchedPassword };
