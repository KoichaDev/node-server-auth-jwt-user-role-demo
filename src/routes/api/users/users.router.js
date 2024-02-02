const express = require('express');
const { getAllUsers } = require('./users.controller');

const usersRouter = express.Router();

usersRouter.get('/get-users', getAllUsers);

module.exports = usersRouter;
