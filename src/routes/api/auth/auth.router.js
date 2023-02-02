const express = require('express');
const { handleLogin, handleLogout } = require('./auth.controller');
const { handleRefreshToken } = require('./tokens.controller');

const authRouter = express.Router();

authRouter.post('/login', handleLogin);
authRouter.post('/logout', handleLogout);
authRouter.get('/refresh', handleRefreshToken);

module.exports = authRouter;
