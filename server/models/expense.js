var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1/';
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
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "category",
    }

});


const expenseModel = mongoose.model("expenseModel", expenseSchema);

module.exports = expenseModel;