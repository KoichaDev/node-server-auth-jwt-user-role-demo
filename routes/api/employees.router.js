const express = require('express');
const employeesJson = require('../../fixtures/employees.json');

const employeesRouter = express.Router();

const data = {};
data.employees = employeesJson;

employeesRouter.get('/', (req, res) => {
	res.status(200).json(data);
});

employeesRouter.get('/:id', (req, res) => {
	const employeeDataById = data.employees.find((data) => data.id === +req.params.id);

	res.status(200).json(employeeDataById);
});

employeesRouter.post('/', (req, res) => {
	res.status(200).json({
		firstName: req.body.firstName,
		lastName: req.body.lastName,
	});
});

employeesRouter.put('/', (req, res) => {
	res.status(200).json({
		firstName: req.body.firstName,
		lastName: req.body.lastName,
	});
});

employeesRouter.delete('/:id', (req, res) => {
	res.json({
		id: req.body.id,
	});
});

module.exports = employeesRouter;
