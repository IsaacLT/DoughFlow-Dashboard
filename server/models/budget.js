// Import mongoose
const mongoose = require('mongoose');

// Connect to MongoDB
var db = mongoose.connect( 'mongodb://0.0.0.0:27017/', {useNewUrlParser: true})

// Create schema for budget entity
var budget = new mongoose.Schema({

    // Budget name
    name: {
        type: String, 
        required: true
    }, 
    // Budget amount
    amount: {
        type: Number,
        required: true
    },
    // Reference to the user model
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    // Reference to the expense model
    expenses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'expense' 
    }],
});

module.exports = mongoose.model('budget', budget);