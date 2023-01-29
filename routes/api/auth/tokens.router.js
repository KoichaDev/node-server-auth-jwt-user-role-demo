const express = require('express');
const { handleRefreshToken } = require('./tokens.controller');

const tokenRouter = express.Router();

tokenRouter.get('/refresh', handleRefreshToken);

module.exports = tokenRouter;
