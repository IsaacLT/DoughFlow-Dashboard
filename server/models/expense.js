var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var mongoURI = process.env.MONGODB_URI || 'mongodb://0.0.0.0:27017/';
var db = mongoose.connect(mongoURI, {useNewUrlParser: true});

const expenseSchema = Schema({
    description: {
        type: String, 
        required: false,
    },
    amount: {
        type: Number,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "user",
    },
    date: {
        type: Date,
        required: true,
    },
    budgetId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "budget",
    }

});


const expenseModel = mongoose.model("expenseModel", expenseSchema);

module.exports = expenseModel;