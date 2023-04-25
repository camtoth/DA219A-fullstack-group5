const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    tableID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tables',
        required: true
    },
    waiterID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Accounts',
        required: true
    },
    startTime: {
        type: Date,
        default: Date.now
    },
    totalPrice: {
        type: Number,
        default: 0
    },
    checkOutTime: {
        type: Date,
        default: null
    },
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MenueItems',
        count: { type: Number, default: 0, required: true },
        purchaseTime: { type: Date, default: Date.now },
        comment: { type: String },
        completed: { type: Boolean, default: false }
    }],
});

module.exports = mongoose.model('Occupation', schema);