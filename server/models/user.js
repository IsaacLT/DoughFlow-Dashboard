const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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