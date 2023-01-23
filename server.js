const express = require('express');
const path = require('path');

const PORT = process.env.PORT || 3500;

const app = express();

// It's a regular expression that matches the root path (`/`) or the path `/index` or
app.get('^/$|/index(.html)?', (req, res) => {
	res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/new-page(.html)?', (req, res) => {
	res.sendFile(path.join(__dirname, 'views', 'new-page.html'));
});

app.get('/old-page(.html)?', (req, res) => {
	res.redirect(301, '/new-page.html');
});

app.get(
	'/hello(.html)?',
	(req, res, next) => {
		console.log('attempted to load hello.html!');

		next();
	},
	(req, res) => {
		res.send('hello world');
	}
);

const one = (req, res, next) => {
	console.log('one');
	next();
};

const two = (req, res, next) => {
	console.log('two');
	next();
};

const three = (req, res, next) => {
	console.log('finished!');
	res.send('finished!');
	next();
};

app.get('/chain(.html)?', [one, two, three]);

app.get('/*', (req, res) => {
	res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

app.listen(PORT, () => console.log(`🚀 Server is running on port ${PORT}`));
