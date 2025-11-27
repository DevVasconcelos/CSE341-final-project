const dbConfig = require('../config/db.config.js');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.genres = require('./genres.js')(mongoose);
db.movies = require('./movies.js')(mongoose);
db.reviews = require('./reviews.js')(mongoose);
db.users = require('./users.js')(mongoose);

module.exports = db;
