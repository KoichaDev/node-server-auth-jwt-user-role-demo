const express = require('express');
const {
	createNewEmployee,
	deleteEmployeeById,
	getAllEmployees,
	getEmployeeById,
	updateEmployeeById,
} = require('./employees.controller');

const { ROLES_LIST } = require('../../../config/constants/rolesList');
const { verifyRoles } = require('../../../middleware/verifyRoles');

const { admin: ADMIN, editor: EDITOR, user: USER } = ROLES_LIST;

const employeesRouter = express.Router();

employeesRouter.post('/', verifyRoles(ADMIN, EDITOR), createNewEmployee);

employeesRouter.get('/', getAllEmployees);

employeesRouter.get('/:id', getEmployeeById);

employeesRouter.put('/:id', updateEmployeeById);

employeesRouter.delete('/:id', verifyRoles(ADMIN), deleteEmployeeById);

module.exports = employeesRouter;
