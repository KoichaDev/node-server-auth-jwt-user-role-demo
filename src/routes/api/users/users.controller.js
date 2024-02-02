const getAllUsers = (req, res) => {
	res.status(200).json(usersDB.users);
};

module.exports = { getAllUsers };
