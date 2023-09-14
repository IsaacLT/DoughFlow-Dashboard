var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1/';
var db = mongoose.connect(mongoURI, {useNewUrlParser: true});


var categorySchema = new Schema({
    categoryName : {
        type : String,
        required : true
    }, 
    expenses : [{
        type: Schema.Types.ObjectId,
        ref: "expenseModel" 
    }]
});

var Category = mongoose.model('category', categorySchema);
module.exports = Category;
