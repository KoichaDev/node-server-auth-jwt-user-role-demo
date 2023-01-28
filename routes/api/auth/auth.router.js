const express = require('express');
const { handleLogin } = require('./auth.controller');

const authRouter = express.Router();

authRouter.post('/', handleLogin);

module.exports = authRouter;
