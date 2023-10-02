var mongoose = require("mongoose");
var Schema = mongoose.Schema;

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
        //required: true,
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