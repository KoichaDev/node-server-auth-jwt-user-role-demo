const express = require('express');
const { handleLogin, handleLogout, createNewUser } = require('./auth.controller');
const { handleRefreshToken } = require('./tokens.controller');

const authRouter = express.Router();

authRouter.post('/login', handleLogin);
authRouter.post('/logout', handleLogout);
authRouter.post('/register', createNewUser);
authRouter.get('/refresh', handleRefreshToken);

module.exports = authRouter;
