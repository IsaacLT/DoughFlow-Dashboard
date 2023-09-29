// Import mongoose
const mongoose = require('mongoose');

// Create schema for budget entity
const budgetSchema = new mongoose.Schema({

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
    // Reference to the category model
    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category' 
    }]
});

module.exports = mongoose.model('budget', budgetSchema);