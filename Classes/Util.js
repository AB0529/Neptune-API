class Main {
    constructor(config, connection) {
        this.config = config;
        this.secret = config.secret;
        this.connection = connection;
        this.hashes = new Set([]);
        this.commands = [];
    }

    // ---------------------------------------------------------------------------

    generateKey() { // Generate API Key
        let charset = `abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-`;
        let length = 25;
        let text = ``;

        for (let i = 0; i < length; i++) {
            text += charset.charAt(Math.floor(Math.random() * charset.length));
        }

        return text;
    }

    // ---------------------------------------------------------------------------

    updateDatabase(name, key, cb) {
        let connection = this.connection;
        let hashed = this.hashKey(key.toString());

        connection.query(`INSERT INTO tokens (user, apiKey) VALUES (?, ?) ON DUPLICATE KEY UPDATE apiKey = \"${hashed}\"`, [name, hashed], function(err) {
            if (err) return cb({
                res: err,
                key: key
            });
            return cb({
                res: `Success`,
                key: key,
                who: name,
                hash: hashed
            });
        });

    }

    // ---------------------------------------------------------------------------

    hashKey(key) {
        const t = this;
        const crypto = require('crypto');
        const hash = crypto.createHmac(`SHA256`, t.secret).update(key).digest('base64');

        return hash;
    }

    // ---------------------------------------------------------------------------

    getKeys() {
        let connection = this.connection;
        let keys = [];

        connection.query(`SELECT * FROM tokens`, function(err, row) {
            if (err) return console.log(err);

            for (let i = 0; i < row.length; i++) {
                keys.push(row[i].apiKey)
            }
            return keys;
        });

    }

    // ---------------------------------------------------------------------------

    checkHash(toCheck) {
        const crypto = require(`crypto`);
        const hash = this.getKeys();
        let t = this;

        for (let h in hash) {
            if (h === crypto.createHmac(`SHA256`, t.config.secret).update(toCheck).digest('base64'))
                return true;
            else
                return false;
        }
    }

    // ---------------------------------------------------------------------------
}

module.exports = Main;