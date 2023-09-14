const express = require("express");
const router = express.Router();
const User = require('../models/user');
const Expense = require('../models/expense');
const jwt = require('jsonwebtoken');
const authenticator = require('../authenticator');
const config = require('../config');


router.post('/login', async function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    // Query the database to retrieve a user by username
    const user = await User.findOne({username});

    //if there is no user return error code
    if (!user) {
        return res.status(404).json({message: "Username not found"});
    }

    // Check if the provided password matches the user's password
    if (user.password !== password) {
        return res.status(401).json({ message: 'Incorrect password' });
    }

    // If the username and password are correct, generate a JWT token
    const token = jwt.sign({username: user.username, userId: user._id}, config.jwtKey, { expiresIn: '2h' });

    res.json({ message: 'Login successful', token});
});

router.post('/users', async function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    const expenses = req.body.expenses;
    const existingUsername = await User.findOne({username: username});
    if(existingUsername) {
        return res.status(400).json({message: 'Username already exists'});
    } else {
        const user = new User({
        "username" : username,
        "password" : password,
        "expenses" : expenses
    });
    await user.save();
    res.json(user);
    }
});

router.get('/users/:username', authenticator, async function (req, res) {
    const username = req.params.username;
    // Query the database to retrieve a user by username
    const user = await User.findOne({username});
    if (!user) {
    return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
});

router.patch('/users/:username', authenticator, async function (req, res) {
    const username = req.params.username;
    // Query the database to retrieve a user by username
    const user = await User.findOne({username});
    if (!user) {
            return res.status(404).json({ message: 'User not found' });
    }
    user.password = req.body.password;
    // Save the updated user
    await user.save();
    res.json(user);
});

router.delete('/users/:username', authenticator, async function(req, res) {
    const username = req.user.username;
    // Query the database to retrieve a user by username
    const user = await User.findOne({username});
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    } 
    await User.deleteOne(user);
    // Send the retrieved user data as the response
    res.json({message: 'User deleted succesfully', user});
});

router.post('/users/:username/expenses', authenticator, async function (req, res) {
    const username = req.params.username;
        // Find the user by username
    const user = await User.findOne({ username });

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
        }
        // Create a new expense based on the request body
        const newExpense = new Expense({
            description: req.body.description,
            amount: req.body.amount,
            userId: user._id,
            date: req.body.date,
            categoryId: req.body.categoryId
        });
        // Save the new expense
        await newExpense.save();
        // Add the new expense to the user's expenses array
        user.expenses.push(newExpense);
        await user.save();
        res.json(newExpense);
});

router.get('/users/:username/expenses', authenticator, async function (req, res) {
    const username = req.params.username;
        // Query the database to retrieve a user by ID
        const user = await User.findOne({ username }).populate("expenses");
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Send the retrieved user data as the response
        res.json(user);
});

router.get('/users/:username/expenses/:id', authenticator, async function (req, res) {
    const username = req.params.username;
    const expenseId = req.params.id;
    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    // Find the expense by its ID and ensure it belongs to the user
    const expense = await Expense.findOne({ _id: expenseId, userId: user._id });
    if (!expense) {
        return res.status(404).json({ message: 'Expense not found', expenseId, username});
    }
    res.json(expense);
});

router.delete('/users/:username/expenses/:id', authenticator, async function (req, res) {
    const username = req.params.username;
    const expenseId = req.params.id;
    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    // Find the expense by its ID and ensure it belongs to the user
    const expense = await Expense.findOne({ _id: expenseId, userId: user._id });
    if (!expense) {
        return res.status(404).json({ message: 'Expense not found'});
    }
    await Expense.deleteOne(expense);
    res.json({message: 'Expense deleted succesfully', expense});
});

module.exports = router;