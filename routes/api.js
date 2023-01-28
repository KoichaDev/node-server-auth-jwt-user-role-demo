const express = require('express');
const authRouter = require('./api/auth/auth.router');
const employeesRouter = require('./api/employees/employees.router');
const usersRouter = require('./api/users/users.router');

const api = express.Router();

api.use('/auth', authRouter);
api.use('/employees', employeesRouter);
api.use('/register', usersRouter);

module.exports = api;
