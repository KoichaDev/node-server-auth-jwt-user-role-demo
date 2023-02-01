const express = require('express');
const { createNewUser, getAllUsers } = require('./users.controller');

const usersRouter = express.Router();

usersRouter.post('/register', createNewUser);
usersRouter.get('/get-users', getAllUsers);

module.exports = usersRouter;
