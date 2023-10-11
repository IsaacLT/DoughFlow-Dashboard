const express = require("express");
const router = express.Router();
const User = require('../models/user');
const Expense = require('../models/expense');
const Budget = require('../models/budget');
const jwt = require('jsonwebtoken');
const authenticator = require('../authenticator');
const config = require('../config');
var methodOverride = require('method-override');
router.use(methodOverride("X-HTTP-Method-Override"));

//Helper method that adds the wanted HATEOAS links as part of the budget within the context of a user
function getUserBudgetLinks(username, budgetId) {
    return {
        self: {
            href: `http://localhost:3000/api/v1/users/${username}/budgets/${budgetId}`
        },
        delete: {
            href: `http://localhost:3000/api/v1/users/${username}/budgets/${budgetId}`,
            method: 'DELETE'
        }
    };
}


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
        // Query the database to retrieve a user by username
        const user = await User.findOne({ username }).populate("expenses");
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        //variables for filtering and sorting a users expenses
        const filters = {};
        const sorting = {};
        //if there are start and end dates add them to filters array
        if (req.query.startDate && req.query.endDate) {
            filters.date = {
                $gte: new Date(req.query.startDate),
                $lte: new Date(req.query.endDate),
            };
        }
        
        if (req.query.order === "asc") {
            sorting.amount = 1;
        } else if (req.query.order === "desc") {
            sorting.amount = -1;
        }

        const expenses = user.expenses
        .filter((expense) => {
            if (!filters.date) return true;
            const expenseDate = new Date(expense.date);
            return expenseDate >= filters.date.$gte && expenseDate <= filters.date.$lte;
        })
        .sort((a, b) => (a.amount - b.amount) * sorting.amount);

        // Send the filtered and sorted expenses as the response
        // Send the retrieved user data as the response
        res.json(expenses);
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
        return res.status(404).json({ message: 'Budget not found'});
    }
    await Expense.deleteOne(expense);
    res.json({message: 'Expense deleted succesfully', expense});
});
//////////////////////////////////////////////////////////////////////////////////


router.post('/users/:username/budgets', authenticator, async function (req, res) {
    const username = req.params.username;
    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    // Create a new budget based on the request body
    const newBudget = new Budget({
        name: req.body.name,
        amount: req.body.amount,
        user: user._id,
    });
    // Save the new budget
    await newBudget.save();
    // Add the new budget to the user's budgets array
    user.budgets.push(newBudget);
    await user.save();
    // Add the HATEOAS links to the budget object before sending the response
    const budgetWithLinks = {
        ...newBudget._doc,
        links: getUserBudgetLinks(username, newBudget._id)
    }
    res.json(budgetWithLinks);
});


router.get('/users/:username/budgets', authenticator, async function (req, res) {
    const username = req.params.username;
    
    // Query the database to retrieve a user by username
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Fetch the budgets associated with this user
    const budgets = await Budget.find({ user: user._id });

    if (budgets.length == 0) {
        return res.status(404).json({ message: 'No budgets exist for this user.' });
    } 

    // Map over the budgets to add the HATEOAS links
    const budgetsWithLinks = budgets.map(budget => ({
        ...budget._doc, 
        links: getUserBudgetLinks(username, budget._id)
    }));

    res.json(budgetsWithLinks);
});

router.get('/users/:username/budgets/:id', authenticator, async function (req, res) {
    const username = req.params.username;
    const budgetId = req.params.id;
    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    // Find the expense by its ID and ensure it belongs to the user
    const budget = await Budget.findOne({ _id: budgetId, user: user._id });
    if (!budget) {
        return res.status(404).json({ message: 'Budget not found'});
    }
    res.json(budget);
});

//Delete a single budget by id
router.delete('/users/:username/budgets/:id', authenticator, async function (req, res) {
    const username = req.params.username;
    const budgetId = req.params.id;
    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    // Find the expense by its ID and ensure it belongs to the user
    const budget = await Budget.findOne({ _id: budgetId, user: user._id });
    if (!budget) {
        return res.status(404).json({ message: 'Budget not found'});
    }
    await Budget.deleteOne(budget);
    res.json({message: 'Budget deleted succesfully', budget});
});

router.delete('/users/:username/budgets', authenticator, async function (req, res) {
    const username = req.params.username;
    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    // Find the expense by its ID and ensure it belongs to the user
    const budget = await Budget.deleteMany({ user: user._id})
    if (!budget) {
        return res.status(404).json({ message: 'Budget not found'});
    }
    res.json({message: 'All budgets deleted succesfully', budget});
});

module.exports = router;