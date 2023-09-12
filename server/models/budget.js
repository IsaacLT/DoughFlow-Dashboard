// Import mongoose
var mongoose = require('mongoose');

// Connect to MongoDB
var mongoURI = process.env.MONGODB_URI || 'mongodb://0.0.0.0:27017/';
var db = mongoose.connect( mongoURI, {useNewUrlParser: true});

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
    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category' 
    }]
});

module.exports = mongoose.model('budget', budget);