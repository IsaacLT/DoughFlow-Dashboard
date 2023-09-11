var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var db = mongoose.connect('mongodb://0.0.0.0:27017/', {useNewUrlParser: true});

var userSchema = new Schema({
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
        ref: "expense"
    }],
    budgets: [{
        type: Schema.Types.ObjectId,
        ref: "budget"
    }]
});

var User = mongoose.model('user', userSchema);
module.exports = User;