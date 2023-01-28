const express = require('express');
const { createNewUser } = require('./users.controller');

const usersRouter = express.Router();

usersRouter.post('/', createNewUser);

module.exports = usersRouter;
