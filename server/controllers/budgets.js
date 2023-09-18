// Import required dependencies
const express = require('express');
const router = express.Router();
const Budget = require('../models/budget');
const Category = require('../models/category');

// Create a new budget instance
router.post('/budgets', async (req,res) => {                              
        if (!req.body.name || isNaN(req.body.amount) || req.body.amount <= 0) {         // Check if budget has name and amount. ("NaN" = not a number)
            return res.status(400).json({ error: 'Invalid budget properties'})
        } else {
            const budget = new Budget(req.body);  
            await budget.save()                     // Save the budget
            res.json(budget);                       // Send the created budget as the response
        } 
});

// Get all budgets
router.get('/budgets', async (req,res) => {
    const budgets = await Budget.find({});        // Query the database to get all budgets
    if (budgets.length == 0) {                    // If no budgets exist, respond with object not found error
        return res.status(404).json({error: 'No budgets exist.'})
    } else {
    res.json(budgets);                            // Send the retrieved budgets as the respose
    }
});

// Get a budget instance
router.get('/budgets/:id', async (req, res) => {
    const budget = await Budget.findById(req.params.id);    // Request id from URL parameters
    if (!budget) {                                          // If no budget exists, respond with object not found error
        return res.status(404).json({ error: 'Budget not found'});
    } else {
        res.json(budget);                                   // Send the retrieved budget as e response
    }
});

// Update all budget attributes (PUT)
router.put('/budgets/:id', async (req, res) => {
    if (!req.body.name || isNaN(req.body.amount) || req.body.amount <= 0) {         // Check if budget has name and amount. ("NaN" = not a number)
        return res.status(400).json({ error: 'Invalid budget properties'})
    } else {
        const updatedBudget = await Budget.findByIdAndUpdate(
            req.params.id,      // Identify the budget to update it by its unique id
            req.body,           // Contains the updated data for the budget
            {new: true}         // Contans the budget with all the changes made during the update. If not implemented, the updatedBudget variable would not reflect the changes made.
        );
        if (!updatedBudget) {
            return res.status(404).json({ error: 'Budget not found'});
        } else {
            res.json(updatedBudget);
        }
    }
});

// Partially update a budget instance (PATCH)
router.patch('/budgets/:id', async (req, res) => {
    const budget = await Budget.findById(req.params.id);
    if (!budget) {
        return res.status(404).json({ error: 'Budget not found'});
    } else {                                                 // If 'req.body.property' is falsy such as 'null', 'undefined' or an empty string, 
        budget.name = req.body.name || budget.name;          // the existing values from the budget object will be used. Ensures that existing values are preserved
        budget.amount = req.body.amount || budget.amount;    // when the corresponding properties are not provided in the request body.
        await budget.save();
        res.json(budget);
    }
});

// Delete all budgets
router.delete('/budgets', async (req, res) => {
    const result = await Budget.deleteMany({});       // {} matches all objects in the Budget collection
    if (!result.deletedCount) {
        return res.status(404).json({ error: 'Budget not found'});
    } else {
        res.json({ message: `Deleted ${result.deletedCount} budgets`});
    }
});

// Delete a budget instance
router.delete('/budgets/:id', async (req, res) => {
    const deletedBudget = await Budget.findByIdAndDelete(req.params.id);
    if (!deletedBudget) {
        return res.status(404).json({ error: 'Budget not found'});
    } else {
        res.json(deletedBudget);
    }
});

// Post operation for endpoint budget/:id/categories
router.post('/budgets/:id/categories', async (req, res) => {
    const budgetId = req.params.id;
    const budget = await budget.findById(budgetId);     // Find the category by Id
    if (!budget) {
         return res.status(404).json({ error: 'Budget not found' });
    } 
    const newCategory = new Category(req.body);         // Create a new category based on the request body
    await newCategory.save();                           // Save the new category
    budget.categories.push(newCategory);                // Add the new expense to the user's expenses array
    await budget.save();                                // Save budget
    res.json(newCategory);
});

// Get operation for endpoint budget/:id/categories
router.get('budgets/:id/categories', async (req, res) => {
    const budgetId = req.params.id;
    const budget = await Budget.findById(budgetId).populate("categories");       // Query the database to retrieve a budget by ID
    if (!budget) {
        return res.status(404).json({ error: 'Budget not found' });
    }
    // Send the retrieved user data as the response
    res.json(budget);
});

// Get operation for endpoint budget/:id/categories/:id
router.get('budgets/:id/categories/:categoryid', async (req, res) => {
    const budgetId = req.params.id;
    const categoryId = req.params.categoryid;
    const budget = await Budget.findById(budgetId);
    if (!budget) {
        return res.status(404).json({ error: 'Budget not found' });
    }
    // Find the category by its ID and ensure it belongs to the budget
    const category = await Category.findOne({ _id: categoryId, budgetId: budget._id });
    if (!category) {
        return res.status(404).json({ error: 'Category not found', categoryId, budget});
    }
    res.json(category);
});

// Delete operation for endpoint budget/:id/categories/:id
router.delete('/budgets/:id/categories/:categoryid', async (req, res) => {
    const budgetId = req.params.id;
    const categoryId = req.params.expenseid;
    const budget = await Budget.findById(budgetId);
    if (!budget) {
        return res.status(404).json({ error: 'Budget not found' });
    }
    // Find the category by its ID and ensure it belongs to the budget
    const category = await Category.findOne({ _id: categoryId, budgetId: budget._id });
    if (!category) {
        return res.status(404).json({ error: 'Category not found', categoryId, budget});
    }
    await Category.deleteOne(category);
    res.json({message: 'Category deleted succesfully', category});
});



module.exports = router;