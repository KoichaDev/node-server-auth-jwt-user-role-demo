const express = require('express');
const employeesRouter = require('./api/employees.router');

const api = express.Router();

api.use('/employees', employeesRouter);

module.exports = api;
