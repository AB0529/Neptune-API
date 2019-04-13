module.exports.run = (req, res, client) => {
	const youtubeSearch = require('youtube-search');

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

		youtubeSearch(req.query.search, {
			maxResults: req.query.maxResults,
			key: client.config.google.key
		}, async function(err, video) {
			if (err)
				return console.log(err);

			let itemList = [];
			await video.map((i) => {
				itemList.push({
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
						channel: i.channelTitle
					},

				});

			});
			// No video found
			if (!video[0])
				return res.json({
					status: 204,
					state: 'fail',
					message: 'No result'
				});
			else
				return res.json({
					status: 200,
					state: 'success',
					result: itemList
				});

		});

	});

};

module.exports.type = 'GET';
