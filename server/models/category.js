var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var categorySchema = new Schema({
    categoryName : {
        type : String,
        required : true
    }, 
    budgetId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "budget",
    },
    expenses : [{
        type: Schema.Types.ObjectId,
        ref: "expenseModel" 
    }],
    totalAmount: {
        type: Number,
        default: 0
    }
});

var Category = mongoose.model('category', categorySchema);
module.exports = Category;
