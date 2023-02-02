const employeeModel = require('../../../models/employee.model');

const createNewEmployee = async (req, res) => {
	if (!req?.body?.firstName || !req?.body?.lastName) {
		// 400 bad request
		res.status(400).json({
			message: 'First and Last Name are required!',
		});
	}

	try {
		const result = await employeeModel.create({
			firstName: req.body.firstName,
			lastName: req.body.lastName,
		});

		res.status(201).json(result);
	} catch (error) {
		console.error('❌', error);
	}
};

const deleteEmployeeById = async (req, res) => {
	const employeeId = req?.params?.id;

	const employee = await employeeModel.findOne({ _id: employeeId }).exec();

	if (!employeeId) {
		return res.status(400).json({
			message: 'Employee ID required',
		});
	}

	if (!employee) {
		return res.status(204).json({
			error: `Employee ID ${employeeId} not found!`,
		});
	}

	const result = await employee.deleteOne();

	res.json(result);
};

const getAllEmployees = async (req, res) => {
	const employees = await employeeModel.find();

	if (!employees) {
		res.status(204).json({
			message: 'No employees found',
		});
	}
	res.json(employees);
};

const getEmployeeById = async (req, res) => {
	const { id } = req?.params ?? {};

	if (!id) {
		if (!id) {
			return res.status(400).json({
				message: 'ID parameter is required',
			});
		}
	}

	const employeeById = await employeeModel.findOne({ _id: id }).exec();

	if (!employeeById) {
		res.status(204).json({
			error: `No employee matches ID ${id} not found!`,
		});
	}

	res.json(employeeById);
};

const updateEmployeeById = async (req, res) => {
	if (!req?.params?.id) {
		return res.status(400).json({
			message: 'ID parameter is required',
		});
	}

	const employee = await employeeModel.findOne({ _id: req?.params?.id }).exec();

	if (!employee) {
		return res.status(204).json({ message: `No Employee matches ID ${req.body.id}` });
	}
	const firstName = req.body?.firstName;
	const lastName = req.body?.lastName;

	if (firstName) {
		employee.firstName = firstName;
	}

	if (lastName) {
		employee.lastName = lastName;
	}

	const result = await employee.save();

	res.json(result);
};

module.exports = { createNewEmployee, deleteEmployeeById, getAllEmployees, getEmployeeById, updateEmployeeById };
