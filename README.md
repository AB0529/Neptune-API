# Neptune-API

API used for various routs such as YouTube and ShareX. Used in [Neptune-API-Wrapper](https://www.npmjs.com/package/neptune-api-wrapper)

## Getting Started

* Download the repository
* Install the dependencies via `npm i`

### Prerequisites

```
NodeJS version 8.x or higher
```

### Installing


Install the dependencies

```
npm i
```

Run the program

```
node server.js
```

### Routes

*GET* `/api/generateKey`


* `?key=` the admin API key

* `&name=` the name of the new keyholder



*GET* `/api/ping`

*GET* `/api/yt_playlist`

* `?key=` API key
* `&maxVideos=` Max videos to get
* `&id=` Playlist ID

*GET* `/api/yt_video`

* `?key=` API key
* `&maxVideos=` Max videos to get
* `&search=` Video name

*POST* `/api/sharex`
* `key`
* `name`
* `file`

## Authors

* **AB0529** - *Initial work* - [AB0529](https://github.com/AB0529)

