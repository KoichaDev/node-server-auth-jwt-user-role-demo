const express = require('express');
const path = require('path');

const root = express.Router();

root.get('^/$|/index(.html)?', (req, res) => {
	res.sendFile(path.join(__dirname, '..', '..', 'views', 'index.html'));
});

root.get('/new-page(.html)?', (req, res) => {
	res.sendFile(path.join(__dirname, '..', '..', 'views', 'new-page.html'));
});

root.get('/old-page(.html)?', (req, res) => {
	res.redirect(301, '/new-page.html');
});

module.exports = root;
