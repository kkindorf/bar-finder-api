const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user');

const BarSchema = new Schema ({
    alias: String,
    numberGoing: {type: Number},
    usersGoing: [String]
});

module.exports = mongoose.model('Bar', BarSchema);

