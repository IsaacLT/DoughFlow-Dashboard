// Import required dependencies
var express = require('express');
var router = express.Router();
var Budget = require('../models/budget');

// Create a new budget instance
router.post('/budgets', async (req,res) => {                              
        var budget = new Budget(req.body);      
        await budget.save()                     // Save the budget
        res.json(budget);                       // Send the created budget as the response
    
});

// Get all budgets
router.get('/budgets', async (req,res) => {
    var budgets = await Budget.find({});        // Query the database to get all budgets
    if (!budgets) {                             // If no budgets exist, respond with object not found error
        return res.status(404).json({error: 'No budgets exist.'})
    } else {
    res.json(budgets);                          // Send the retrieved budgets as the respose
    }
});

// Get a budget instance
router.get('/budgets/:id', async (req, res) => {
    var budget = await Budget.findById(req.params.id);      // Request id from URL parameters
    if (!budget) {                                          // If no budget exists, respond with object not found error
        return res.status(404).json({ error: 'Budget not found'});
    } else {
        res.json(budget);                                   // Send the retrieved budget as e response
    }
});

// Update all budget attributes (PUT)
router.put('budgets/:id', async (req, res) => {
    var updatedBudget = await Budget.findByIdAndUpdate(
        req.params.id,      // Identify the budget yo update it by its unique id
        req.body,           // Contains the updated data for the budget
        {new: true}         // Contans the budget with all the changes made during the update. If not implemented, the updatedBudget variable would not reflect the changes made.
    );
    if (!updatedBudget) {
        return res.status(404).json({ error: 'Budget not found'});
    } else {
        res.json(updatedBudget);
    }
});

// Partially update a budget instance (PATCH)
router.patch('/budgets/:id', async (req, res) => {
    var budget = await Budget.findById(req.params.id);
    if (!budget) {
        return res.status(404).json({ error: 'Budget not found'});
    } else {                                                 // If 'req.body.property' is falsy such as 'null', 'undefined' or an empty string, 
        budget.name = req.body.name || budget.name;          // the existing values from the budget object will be used. Ensures that existing values are preserved
        budget.amount = req.body.amount || budget.amount;    // when the corresponding properties are not provided in the request body.
        budget = await budget.save();
        res.json(budget);
    }
});

// Delete all budgets
router.delete('/budgets/:id', async (req, res) => {
    var result = await Budget.deleteMany({});
    if (!result.deletedCount) {
        return res.status(404).json({ error: 'No budgets found'});
    } else {
        res.json({ message: 'Deleted ${result.deletedCount} budgets'});
    }
});

// Delete a budget instance
router.delete('/budgets/:id', async (req, res) => {
    var deletedBudget = await Budget.findByIdAndDelete(req.params.id);
    if (!deletedBudget) {
        return res.status(404).json({ error: 'Budget not found'});
    } else {
        res.json(deletedBudget);
    }
});

module.exports = router;