const data = {
	employees: require('../../../models/employees.json'),
	setEmployees(data) {
		this.employees = data;
	},
};

const getAllEmployees = (req, res) => {
	res.status(200).json(data.employees);
};

const getEmployeeById = (req, res) => {
	const employeeDataById = data.employees.find((data) => data.id === +req.params.id);

	if (!employeeDataById) {
		res.status(400).json({
			error: `Employee ID ${req.body.id} not found!`,
		});
	}

	res.status(200).json(employeeDataById);
};

const createNewEmployee = (req, res) => {
	const newEmployee = {
		id: data.employees[data.employees.length - 1].id + 1 || 1,
		firstName: req.body.firstName,
		lastName: req.body.lastName,
	};

	if (!newEmployee.firstName || !newEmployee.lastName) {
		return res.status(404).json({
			error: 'First and last names are required!',
		});
	}

	data.setEmployees([...data.employees, newEmployee]);
	res.status(201).json(data.employees);
};

const deleteEmployeeById = (req, res) => {
	const employee = data.employees.find((employee) => employee.id === +req.body.id);

	if (!employee) {
		return res.status(400).json({
			error: `Employee ID ${req.body.id} not found!`,
		});
	}

	const filteredArray = data.employees.filter((employee) => {
		return employee.id !== +req.body.id;
	});

	data.setEmployees([...filteredArray]);

	res.json(data.employees);
};

const updateEmployeeById = (req, res) => {
	const employee = data.employees.find((emp) => emp.id === parseInt(req.body.id));
	if (!employee) {
		return res.status(400).json({ message: `Employee ID ${req.body.id} not found` });
	}
	if (req.body.firstName) {
		employee.firstName = req.body.firstName;
	}
	if (req.body.lastName) {
		employee.lastName = req.body.lastName;
	}
	const filteredArray = data.employees.filter((emp) => emp.id !== parseInt(req.body.id));
	const unsortedArray = [...filteredArray, employee];
	const sortedArray = unsortedArray.sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0));

	data.setEmployees(sortedArray);
	res.json(data.employees);
};

module.exports = { createNewEmployee, deleteEmployeeById, getAllEmployees, getEmployeeById, updateEmployeeById };
