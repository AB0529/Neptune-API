module.exports.run = (req, res, client) => {
	try {
		return res.json({
			status: 200,
			state: 'success',
			message: 'Hell yeah it works!'
		});
	} catch (err) {
		return res.json({
			status: 500,
			state: 'server error',
			message: err
		});
	}
};

module.exports.type = 'GET';
