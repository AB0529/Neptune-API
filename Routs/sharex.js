const fs = require('fs');

module.exports.run = (req, res, client) => {
  let key = req.body.key;
  let name = req.body.name;

  // Check secret
  if (key !== client.config.sharex.key)
    return res.end(`Unauthorized.`);
  // Upload file
  fs.writeFileSync(`${client.config.sharex.path}/${name}.png`, req.file.buffer);
  return res.end(`${client.config.sharex.url}/images/${name}.png`);
};

module.exports.type = 'POSTY';
