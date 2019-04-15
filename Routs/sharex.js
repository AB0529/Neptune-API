const fs = require('fs');
  
module.exports.run = (req, res, client) => {
  let key = req.body.key;
  let name = req.body.name;

  // Check secret
  if (key !== config.sharex_key)
    return res.end(`Unauthorized.`);
  // Upload file
  fs.writeFileSync(`/var/www/pics/images/${name}.png`, req.file.buffer);
  return res.end(`https://pics.quarkz.xyz/images/${name}.png`);
};

module.exports.type = 'POSTY';
