const express = require("express");
const router = express.Router();
const User = require('../models/user');
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
    const existingUsername = await User.findOne({username: username});
    if(existingUsername) {
        return res.status(400).json({message: 'Username already exists'});
    } else {
        const user = new User({
        "username" : username,
        "password" : password
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
    res.json({message: 'User deleted succesfully'});
});

router.get('/users/:username/budgets', authenticator, async function (req, res) {
    const username = req.params.username;
    // Query the database to retrieve a user by ID
    const user = await User.findOne(username).populate("budgets");
    if (!user) {
        return res.status(404).json({ message: 'User not found'});
    }
    // Send the retrieved user data as the response
    res.json(user);
});

router.get('/users/:username/expenses', authenticator, async function (req, res) {
    const username = req.params.username;
        // Query the database to retrieve a user by ID
        const user = await User.findOne(username).populate("expenses");
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Send the retrieved user data as the response
        res.json(user);
});
module.exports = router;