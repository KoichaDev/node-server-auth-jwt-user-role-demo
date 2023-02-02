const express = require('express');
const authRouter = require('./api/auth/auth.router');
const employeesRouter = require('./api/employees/employees.router');
const usersRouter = require('./api/users/users.router');
const verifyJWT = require('../middleware/verifyJWT');

const api = express.Router();

api.use('/auth', authRouter);
api.use('/users', usersRouter);
// This works like a waterfall. Everything that happens verifyJWT will be used
// the middleware of it
api.use(verifyJWT);
api.use('/employees', employeesRouter);

module.exports = api;
