const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        maxlength: 20
    },
    lastName: {
        type: String,
        required: true,
        maxlength: 25
    },
    username: {
        type: String,
        required: true,
        maxlength: 15
    },
    password: {
        type: String,
        required: true,
        maxlength: 100
    },
    role: {
        type: String,
        required: true,
        enum: ['admin', 'waiter', 'cook']
    },
});

module.exports = mongoose.model('Accounts', schema);