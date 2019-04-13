module.exports.run = (req, res, client) => {
	if (client.util.hasKey(req.query.key) !== client.config.adminKey)
		return res.json({
			status: 401,
			state: 'fail',
			message: 'Access denined'
		});
	else if (!req.query.name || req.query.name == '' || req.query.name === undefined)
		return res.json({
			status: 400,
			state: 'fail',
			message: 'No name'
		});

	let key = client.util.generateKey();
	client.util.updateDatabase(req.query.name, key, function(res) {
		res.json({
            message: `Inserted ${result.key} for ${req.query.name}`,
            result: result.res,
            who: result.who,
            hash: result.hash
        });
	});

};
module.exports.type = 'GET';
