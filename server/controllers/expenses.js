const express = require("express");
const router = express.Router();
const expense = require("../models/expense");
const authenticator = require('../authenticator');
const category = require('../models/category')


//CREATE: Create a new expense record
router.post("/expenses", authenticator, async (req, res) => {
    try {
        const newExpense = new expense(req.body);
        const savedExpense = await newExpense.save();
        res.status(201).json(savedExpense);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

//READ: Get all expenses
router.get("/expenses", authenticator, async (req, res) => {
    try {
        const expenses = await expense.find({});
        if(expenses.length === 0){
            res.status(404).json({ error: "No expenses found" });
        } else {
            res.json(expenses);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



//READ: Get a single expense by ID
router.get("/expenses/:id", authenticator, async (req, res) => {
    try {
        const expenseItem = await expense.findById(req.params.id);
        if (!expenseItem) {
            res.status(404).json({ error: "Expense not found" });
        } else {
            res.json(expenseItem); 
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



//UPDATE: Update an expense record by ID
router.put("/expenses/:id", authenticator, async (req, res) => {
    try {
        const currentExpense = await expense.findById(req.params.id);
        const currentAmount = currentExpense.amount;
        const updatedExpense = await expense.findByIdAndUpdate(req.params.id, req.body, {new: true});
        const updatedAmount = updatedExpense.amount;
        const updatedCategory = await category.findOne({_id: updatedExpense.categoryId})
        updatedCategory.totalAmount -= currentAmount;
        updatedCategory.totalAmount += updatedAmount;
        updatedCategory.save();
        if (!updatedExpense) {
            res.status(404).json({ error: "Expense not found" });
        } else {
            res.json(updatedExpense);
        }
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
});



//PATCH: Update an expense record by ID
router.patch("/expenses/:id", authenticator, async (req, res) => {
    try {
        const updatedExpense = await expense.findByIdAndUpdate(req.params.id, { $set: req.body}, {new:true});
        if (!updatedExpense) {
            res.status(404).json({ error: "Expense not found" });
        } else {
            res.json(updatedExpense);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



//DELETE: Delete an expense record by ID
router.delete("/expenses/:id", authenticator, async (req, res) => {
    try {
        const deletedExpense = await expense.findByIdAndRemove(req.params.id);
        if (!deletedExpense) {
            res.status(404).json({ error: "Expense not found" });
        } else {
            res.json({ message: "Expense deleted successfully" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



//DELETE: Delete all expenses
router.delete("/expenses", authenticator, async (req, res) => {
    var result = await expense.deleteMany({});
        if (result.deletedCount !== 0) {
            res.json({ message: "All expenses deleted successfully" });
        } else {
            res.status(404).json({ error: "No expenses found to delete" });
        }
    
});

module.exports = router;
