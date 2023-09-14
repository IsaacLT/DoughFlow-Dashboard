const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1/';
const db = mongoose.connect(mongoURI, {useNewUrlParser: true});

const userSchema = new Schema({
    username : {
        type: String,
        required: true,
        unique: true
    },
    password : {
        type: String,
        required: true
    },
    expenses : [{
        type: Schema.Types.ObjectId,
        ref: "expenseModel"
    }],
    budgets: [{
        type: Schema.Types.ObjectId,
        ref: "budget"
    }]
});

const User = mongoose.model('user', userSchema);
module.exports = User;