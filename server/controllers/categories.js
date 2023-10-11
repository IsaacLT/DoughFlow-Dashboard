const express = require("express");
const router = express.Router();
const Category = require('../models/category');
const Expense = require('../models/expense');
const authenticator = require('../authenticator');

router.post('/categories', authenticator, async function (req, res) {
    try {
    const name = req.body.categoryName;
    const existingCategory = await Category.findOne({categoryName: name});
    if(existingCategory) {
        return res.status(400).json({message: 'Category name already exists'});
    } else {
        const category = new Category({
        "categoryName" : name
    });
    await category.save();
    res.json(category);
    }
    } catch (err) {
    res.status(500).json({ error: err.message });   
    }
});

router.get('/categories', authenticator, async function (req, res) {
    try {
    const categories = await Category.find({});
    if(categories.length == 0) {
        res.status(404).json({message: "No categories found"});
    } else {
    res.json(categories);
    }
    } catch (err) {
    res.status(500).json({ error: err.message });
    }
});

router.get('/categories/:id', authenticator, async function (req, res) {
    try {
    const id = req.params.id;
    // Query the database to retrieve a category by category name
    const category = await Category.findOne({_id: id});
    if (!category) {
    return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.patch('/categories/:id', authenticator, async function (req, res) {
    try {
    const id = req.params.id;
    // Query the database to retrieve a category by ID
    const category = await Category.findOne({_id: id});
    if (!category) {
            return res.status(404).json({ message: 'Category not found' });
    }
    category.categoryName = req.body.categoryName;
    // Save the updated category
    await category.save();
    res.json(category);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});

router.delete('/categories/:id', authenticator, async function(req, res) {
    try {
    const id = req.params.id;
    // Query the database to retrieve a category by ID
    const category = await Category.findOne({_id: id});
    if (!category) {
        return res.status(404).json({ message: 'Category not found' });
    } 
    await Category.deleteOne(category);
    res.json({message: 'Category deleted succesfully'});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/categories/:id/expenses', authenticator, async function (req, res) {
    try {
    const categoryId = req.params.id;
    // Find the category by Id
    const category = await Category.findById(categoryId);

    if (!category) {
        return res.status(404).json({ message: 'Category not found' });
        }
        // Create a new expense based on the request body
        const newExpense = new Expense({
            description: req.body.description,
            amount: req.body.amount,
            userId: '6503106b83a74e0faa10c19d', //random ID for testing purposes
            date: req.body.date,
            categoryId: category._id
        });
        // Save the new expense
        await newExpense.save();
        // Add the new expense to the user's expenses array
        category.expenses.push(newExpense);
        category.totalAmount += newExpense.amount
        await category.save();
        res.json(newExpense);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/categories/:id/expenses', authenticator, async function (req, res) {
    try {
    const categoryId = req.params.id;
        // Query the database to retrieve a user by ID
        const category = await Category.findById(categoryId).populate("expenses");
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        // Send the retrieved user data as the response
        res.json(category);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/categories/:id/expenses/:expenseid', authenticator, async function (req, res) {
    try {
    const categoryId = req.params.id;
    const expenseId = req.params.expenseid;
    // Find the category by Id
    const category = await Category.findById(categoryId);
    if (!category) {
        return res.status(404).json({ message: 'Category not found' });
    }
    // Find the expense by its ID and ensure it belongs to the category
    const expense = await Expense.findOne({ _id: expenseId, categoryId: category._id });
    if (!expense) {
        return res.status(404).json({ message: 'Expense not found', expenseId, category});
    }
    res.json(expense);
    } catch (err) {
     res.status(500).json({ error: err.message });
    }
});

router.delete('/categories/:id/expenses/:expenseid', authenticator, async function (req, res) {
    try {
    const categoryId = req.params.id;
    const expenseId = req.params.expenseid;
    // Find the category by Id
    const category = await Category.findById(categoryId);
    if (!category) {
        return res.status(404).json({ message: 'Category not found' });
    }
    // Find the expense by its ID and ensure it belongs to the category
    const expense = await Expense.findOne({ _id: expenseId, categoryId: category._id });
    if (!expense) {
        return res.status(404).json({ message: 'Expense not found', categoryId, expenseId});
    }
    await Expense.deleteOne(expense);
    res.json({message: 'Expense deleted succesfully', expense});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;