const http = require('http');
const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;

const logEvents = require('./logEvents');
const EventEmitter = require('events');

// initialize object
class Emitter extends EventEmitter {}

// add listener for the log event
const emitter = new Emitter();
emitter.on('log', (msg, fileName) => logEvents(msg, fileName));

const PORT = process.env.PORT || 3500;

const serveFile = async (filePath, contentType, response) => {
	try {
		const rawData = await fsPromises.readFile(filePath, !contentType.includes('image') ? 'utf8' : '');
		const data = contentType === 'application/json' ? JSON.parse(rawData) : rawData;

		response.writeHead(filePath.includes('404.html') ? 404 : 200, { 'Content-Type': contentType });

		response.end(contentType === 'application/json' ? JSON.stringify(data) : data);
	} catch (error) {
		console.log(error);
		emitter.emit('log', `${error.name}: ${error.message}`, `errLog.txt`);

		// cannot read the data from the server that we want
		response.statusCode = 500;
		response.end();
	}
};

const server = http.createServer((req, res) => {
	console.log(req.url, req.method);
	emitter.emit('log', `${req.url}\t${req.method}`, `reqLog.txt`);

	const fileNameExtensionType = path.extname(req.url);

	let contentType;

	switch (fileNameExtensionType) {
		case '.css':
			contentType = 'text/css';
			break;
		case '.js':
			contentType = 'text/javascript';
			break;
		case '.json':
			contentType = 'application/json';
			break;
		case '.jpg':
			contentType = 'image/jpeg';
			break;
		case '.png':
			contentType = 'image/png';
			break;
		case '.txt':
			contentType = 'text/plain';
			break;
		default:
			contentType = 'text/html';
	}

	let filePath =
		contentType === 'text/html' && req.url === '/'
			? path.join(__dirname, 'views', 'index.html')
			: contentType === 'text/html' && req.url.slice(-1) === '/'
			? path.join(__dirname, 'views', req.url, 'index.html')
			: contentType === 'text/html'
			? path.join(__dirname, 'views', req.url)
			: path.join(__dirname, req.url);

	// makes .html extension not required in the browser
	if (!fileNameExtensionType && req.url.slice(-1) !== '/') {
		filePath += '.html';
	}

	const fileExist = fs.existsSync(filePath);

	if (fileExist) {
		serveFile(filePath, contentType, res);
	} else {
		switch (path.parse(filePath).base) {
			case 'old-page.html':
				res.writeHead(301, { Location: '/new-page.html' });
				res.end();
				break;
			case 'www-page.html':
				res.writeHead(301, { Location: '/' });
				res.end();
				break;
			default:
				serveFile(path.join(__dirname, 'views', '404.html'), 'text/html', res);
		}
	}
});

server.listen(PORT, () => console.log(`🚀 Server running on PORT ${PORT}`));
