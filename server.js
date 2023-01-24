const express = require('express');
const path = require('path');
const { logger } = require('./middleware/logEvents');
const { errorHandler } = require('./middleware/errorHandler');
const cors = require('cors');

const PORT = process.env.PORT || 3500;

const app = express();

// Custom Middle-ware Logger
app.use(logger);

// Cross Origins Resource Sharing
const whiteList = ['https://www.yoursite.com', 'http://localhost:3500'];
const corsOptions = {
	origin: (origin, callback) => {
		if (whiteList.indexOf(origin) !== -1 || !origin) {
			callback(null, true);
		} else {
			callback(new Error('❌ Not Allowed By CORS'));
		}
	},
	optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// app.use() is what we often use to apply middleware to all routes that are coming in
// built-in middleware to handle urlencoded data
// in order words, form data:
// 'content-type: application/x-www-form-urlencoded'
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
// if json data is submitted, we need to be able to get those parameters or that data
// out of submission
app.use(express.json());

// built-in to serve static files
// it will search the route public directory for the request before it moves to another routes
app.use(express.static(path.join(__dirname, '/public')));

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

// app.all() is for more routing and will apply to all http methods at once
app.all('*', (req, res) => {
	res.status(404);

	if (req.accepts('html')) {
		res.sendFile(path.join(__dirname, 'views', '404.html'));
	} else if (req.accepts('json')) {
		res.json({
			error: '404 not found',
		});
	} else {
		res.type('txt').send('404 Not Found');
	}
});

// this is to make it cleaner to show output if something went wrong with the error
// in front-end of the response
app.use(errorHandler);

app.listen(PORT, () => console.log(`🚀 Server is running on port ${PORT}`));
