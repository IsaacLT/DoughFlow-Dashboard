var express = require("express");
var router = express.Router();
var User = require('../models/user');

router.post('/users', async function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var existingUsername = await User.findOne({username: username})
    if(existingUsername) {
        return res.status(400).json({message: 'Username already exists'});
    } else {
        var user = new User({
        "username" : username,
        "password" : password
    });
    await user.save();
    res.json(user);
    }
});

router.get('/users/:username', async function (req, res) {
    var username = req.params.username;
    // Query the database to retrieve a user by username
    var user = await User.findOne({username});
    if (!user) {
    return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
});

router.patch('/users/:username', async function (req, res) {
    var username = req.params.username;
    // Query the database to retrieve a user by username
    var user = await User.findOne({username});
    if (!user) {
            return res.status(404).json({ message: 'User not found' });
    }
    user.password = req.body.password;
    // Save the updated user
    await user.save();
    res.json(user);
});

router.delete('/users/:username', async function(req, res) {
    var username = req.params.username;
    // Query the database to retrieve a user by username
    var user = await User.findOne({username});
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    } 
    await User.deleteOne(user);
    // Send the retrieved user data as the response
    res.json({message: 'User deleted succesfully'});
});

router.get('/users/:username/budgets', async function (req, res) {
    var username = req.params.username;
    // Query the database to retrieve a user by ID
    var user = await User.findOne(username).populate("budgets");
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    // Send the retrieved user data as the response
    res.json(user);
});

router.get('/users/:username/expenses', async function (req, res) {
    var username = req.params.username;
        // Query the database to retrieve a user by ID
        var user = await User.findOne().populate("expenses");
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Send the retrieved user data as the response
        res.json(user);
});
module.exports = router;