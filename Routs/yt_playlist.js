module.exports.run = (req, res, client) => {
	const ypi = require('youtube-playlist-info');

	if (!req.query.key)
			return res.json({
					status: 400,
					state: 'fail',
					message: 'No key'
				});

	client.util.connection.query(`SELECT * FROM tokens`, function(err, row) {
		if (err)
			return console.log(err);
		for (let i = 0; i < row.length; i++)
			client.util.hashes.add(row[i].apiKey);
		if (!client.util.hashes.has(client.util.hashKey(req.query.key)))
			return res.json({
				status: 401,
				state: 'fail',
				message: 'API key rejection'
			});

		if (!req.query.search)
			return res.json({
					status: 400,
					state: 'fail',
					message: 'No search'
				});

		let list = [];

		ypi(client.config.google.key, req.query.id, {
			maxResults: req.query.maxVideos
		}).then((items) => {
			items.map((i) => {
				list.push({
					thumbnail: {
						default: {
							url: i.thumbnails.default.url,
							height: i.thumbnails.default.height,
							width: i.thumbnails.default.width
						},
						medium: {
							url: i.thumbnails.medium.url,
							height: i.thumbnails.medium.height,
							width: i.thumbnails.medium.width
						},
						high: {
							url: i.thumbnails.high.url,
							height: i.thumbnails.default.height,
							width: i.thumbnails.default.width
						}
					},
					video: {
						id: i.id,
						url: i.link,
						title: i.title,
						description: i.description,
						published: i.publishedAt,
						position: i.position
					},
					playlist: {
						id: items[0].playlistId,
						channel: i.channelTitle
					}
				});
			});

			// Nothing found
			if (!items[0])
				return res.json({
					status: 204,
					state: 'fail',
					message: 'No result'
				});
			else
				return res.json({
					status: 200,
					state: 'success',
					result: list
				});

		});


	});
};

module.exports.type = 'GET';
