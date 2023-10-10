
const express = require('express');
const router = express.Router();
const Budget = require('../models/budget');
const Category = require('../models/category');
const authenticator = require('../authenticator');

//Helper method that adds the wanted HATEOAS links as part of the object
function getBudgetLinks(budgetId) {
    return {
        self: {
            href: `http://localhost:3000/api/v1/budgets/${budgetId}`
        },
        delete: {
            href: `http://localhost:3000/api/v1/budgets/${budgetId}`,
            method: 'DELETE'
        }
    };
}


// Create a new budget instance
router.post('/budgets', authenticator, async (req,res) => {                              
        if (!req.body.name || isNaN(req.body.amount) || req.body.amount <= 0) {         // Check if budget has name and amount. ("NaN" = not a number)
            return res.status(400).json({ error: 'Invalid budget properties'})
        } else {
            //Add the HATEOAS links to the budget object when creating it immediately
            const budget = new Budget(req.body);  
            await budget.save();                     // Save the budget
            const budgetWithLinks = {
                ...budget._doc,
                links: getBudgetLinks(budget._id)
            }
            res.json(budgetWithLinks);                       // Send the created budget as the response
        } 
});

// Get all budgets
router.get('/budgets', authenticator, async (req,res) => {
    const budgets = await Budget.find({});        // Query the database to get all budgets
    if (budgets.length == 0) {                    // If no budgets exist, respond with object not found error
        return res.status(404).json({error: 'No budgets exist.'})
    } else {
        const budgetsWithLinks = budgets.map(budget => ({
            ...budget._doc, 
            links: getBudgetLinks(budget._id)
        }));
    res.json(budgetsWithLinks);                            // Send the retrieved budgets as the respose
    }
});

// Get a budget instance
router.get('/budgets/:id', authenticator, async (req, res) => {
    const budget = await Budget.findById(req.params.id);    // Request id from URL parameters
    if (!budget) {                                          // If no budget exists, respond with object not found error
        return res.status(404).json({ error: 'Budget not found'});
    } else {
        res.json({
            ...budget._doc,
            links: getBudgetLinks(req.params.id)
        });                                   // Send the retrieved budget as e response
    }
});

// Update all budget attributes (PUT)
router.put('/budgets/:id', authenticator, async (req, res) => {
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
router.patch('/budgets/:id', authenticator, async (req, res) => {
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
router.delete('/budgets', authenticator, async (req, res) => {
    const result = await Budget.deleteMany({});       // {} matches all objects in the Budget collection
    if (!result.deletedCount) {
        return res.status(404).json({ error: 'Budget not found'});
    } else {
        res.json({ message: `Deleted ${result.deletedCount} budgets`});
    }
});

// Delete a budget instance
router.delete('/budgets/:id', authenticator, async (req, res) => {
    const deletedBudget = await Budget.findByIdAndDelete(req.params.id);
    if (!deletedBudget) {
        return res.status(404).json({ error: 'Budget not found'});
    } else {
        res.json(deletedBudget);
    }
});

// Post operation for endpoint budget/:id/categories
router.post('/budgets/:id/categories', authenticator, async (req, res) => {
    const budgetId = req.params.id;
    const budget = await Budget.findById(budgetId);     // Find the category by Id
    if (!budget) {
         return res.status(404).json({ error: 'Budget not found' });
    } 
    const newCategory = new Category(req.body);         // Create a new category based on the request body
    newCategory.budgetId = budget._id;                  // Assign budgetId to the new category
    await newCategory.save();                           // Save the new category
    budget.categories.push(newCategory);                // Add the new expense to the user's expenses array
    await budget.save();                                // Save budget
    res.json(newCategory);
});

// Get operation for endpoint budget/:id/categories
router.get('/budgets/:id/categories', authenticator, async (req, res) => {
    const budgetId = req.params.id;
    const budget = await Budget.findById(budgetId).populate("categories");       // Query the database to retrieve a budget by ID
    if (!budget) {
        return res.status(404).json({ error: 'Budget not found' });
    }
    // Send the retrieved user data as the response
    res.json(budget);
});

// Get operation for endpoint budget/:id/categories/:id
router.get('/budgets/:id/categories/:categoryId', authenticator, async (req, res) => {
    const budgetId = req.params.id;
    const categoryId = req.params.categoryId;
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
router.delete('/budgets/:id/categories/:categoryId', authenticator, async (req, res) => {
    const budgetId = req.params.id;
    const categoryId = req.params.categoryId;
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