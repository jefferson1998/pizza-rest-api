
const mongoose = require('../../database');
const FlavorSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    value: {
        type: Number,
        required: true,
    },
    ingredients: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const Flavor = mongoose.model('Flavor', FlavorSchema);

module.exports = Flavor;