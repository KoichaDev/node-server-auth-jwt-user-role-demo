const express = require('express');
const path = require('path');

const router = express.Router();

// It's a regular expression that matches the root path (`/`) or the path `/index` or
router.get('^/$|/index(.html)?', (req, res) => {
	res.sendFile(path.join(__dirname, '..', '..', 'views', 'subdir', 'index.html'));
});

router.get('/test(.html)?', (req, res) => {
	res.sendFile(path.join(__dirname, '..', '..', 'views', 'subdir', 'test.html'));
});

module.exports = router;
