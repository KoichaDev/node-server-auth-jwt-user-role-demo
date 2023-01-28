const express = require('express');
const {
	createNewEmployee,
	deleteEmployeeById,
	getAllEmployees,
	getEmployeeById,
	updateEmployeeById,
} = require('./employees.controller');

const employeesRouter = express.Router();

employeesRouter.post('/', createNewEmployee);

employeesRouter.get('/', getAllEmployees);

employeesRouter.get('/:id', getEmployeeById);

employeesRouter.put('/:id', updateEmployeeById);

employeesRouter.delete('/:id', deleteEmployeeById);

module.exports = employeesRouter;
