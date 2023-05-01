const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 40
    },
    price: {
        type: Number,
        required: true
    },
    category : {
        type: String,
        required: true
    },
});

module.exports = mongoose.model('MenuItems', schema);