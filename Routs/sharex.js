const fs = require('fs');
const isGif = require('is-gif');

module.exports.run = (req, res, client) => {
	let key = req.body.key;
	let name = req.body.name;

	// Check secret
	if (key !== client.config.sharex.key)
		return res.end(`Unauthorized.`);
	// Upload file
	if (isGif(req.file.buffer)) {
		fs.writeFileSync(`${client.config.sharex.path}/${name}.gif`, req.file.buffer);
		return res.end(`${client.config.sharex.url}/${name}.gif`);
	}
	fs.writeFileSync(`${client.config.sharex.path}/${name}.png`, req.file.buffer);
	return res.end(`${client.config.sharex.url}/${name}.png`);
};

module.exports.type = 'POSTY';
