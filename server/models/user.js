var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/';

var db = mongoose.connect(mongoURI, {useNewUrlParser: true});

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