// Import libs
const express = require('express');
const curl = require('curl');
const mysql = require('mysql');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const fs = require('fs');
const colors = require('colors');
const Util = require('./Classes/Util.js');

// Load variables
let client = {};

// Config & MySQL
const config = require('./config.json');
const connection = mysql.createConnection({
	host: config.mysql.host,
	user: config.mysql.user,
	password: config.mysql.password,
	database: config.mysql.database,
	charset: 'utf8mb4_unicode_ci'
});
const util = new Util(config, connection);

client.config = config;
client.connection = connection;
client.curl = curl;
client.util = util;

// Handle MySQL server error
connection.on('error', function(err) {
	log(`MySQL Error`, err);
});

// Express
const app = express();
const port = 8080;
const upload = multer();

// Rate limit
// app.enable('trust proxy');
app.use(rateLimit({
	windowMs: 25 * 60 * 1000,
	max: 100
}));

// API Routs
let routs = fs.readdirSync(`./Routs/`);

try {
	routs.map(async (file) => {
		let rout = require(`./Routs/${file}`);
		let type = rout.type == 'GET' ? `GET`.magenta : `POST`.blue;

		console.log(`${`Loaded`.green} ${type} ${`${file}`.yellow}`);

		if (rout.type == 'GET') {
			app.get(`/api/${file.replace(/\.js$/, '')}`, (req, res) => require(`./Routs/${file}`).run(req, res, client));
		}
		else if (rout.type == 'POST') {
			app.post(`/api/${file.replace(/\.js$/, '')}`, (req, res) => require(`./Routs/${file}`).run(req, res, client));
		}
		else if (rout.type == 'POSTY') {
			app.post(`/api/${file.replace(/\.js$/, '')}`, upload.single('d'), (req, res) => require(`./Routs/${file}`).run(req, res, client));
		}

	});
} catch(err) {
	log(`Rout error`, err);
}

// Start server
app.listen(port, () => log('Express', `Listening on port ${port}`));

// Functions
// Pretty log
function log(title = '' || '', content = '' || '', extra = '' || '') {
	console.log(`[` + `${title}`.red + ']' + ` ${content}` + ` ${extra}`);
}
