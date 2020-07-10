
const mongoose = require('../../database');
const RequestSchema = new mongoose.Schema({

    pizzas: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pizza',
    }],
    value: {
        type: Number,
        required: true,
    },
    discount: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});


const Request = mongoose.model('Request', RequestSchema);

module.exports = Request;