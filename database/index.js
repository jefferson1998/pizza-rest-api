const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/rest', { useMongoClient: true });
mongoose.Promise = global.Promise;

module.export = mongoose;

