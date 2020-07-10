
const mongoose = require('../../database');
const PizzaSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
    },
    flavor: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Flavor',
        required: true,
    }],
    request: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Request',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});


const Pizza = mongoose.model('Pizza', PizzaSchema);

module.exports = Pizza;