const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    number: {
        type: Number,
        required: true
    },
    seats: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Tables', schema);