const express = require('express');
const rootRoutes = require('./views/root');
const subDirRoutes = require('./views/subDir');

const viewRoutes = express.Router();

viewRoutes.use('/', rootRoutes);
viewRoutes.use('/subdir', subDirRoutes);

module.exports = viewRoutes;
