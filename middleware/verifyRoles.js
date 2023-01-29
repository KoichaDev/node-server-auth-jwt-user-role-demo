const verifyRoles = (...allowedRoles) => {
	return (req, res, next) => {
		if (!req?.roles) {
			// 401 = unauthorized
			return res.sendStatus(401);
		}

		const rolesArrays = [...allowedRoles];

		console.log(rolesArrays);
		console.log(req.roles);

		const result = req.roles.map((role) => rolesArrays.includes(role)).find((value) => value === true);

		if (!result) {
			return res.sendStatus(401);
		}

		next();
	};
};

module.exports = { verifyRoles };
