var express = require("express");
var router = express.Router();
var User = require('../models/user');

router.post('/users', function (req, res) {
            var user = {
            "username" : req.username,
            "password" : req.password
        }
        res.json(user);
        });

router.get('/users', function(req, res) {
    res.json({"user" : User});
});

router.delete('/user', function(req, res) {
    res.deleteMany({}, callback);
});

router.get('/user:id',  function(req, res) {
    res.json(User[req.params.id]);
});

router.put('/users/:id', function(req, res) {
    var id = req.params.id;
    var updated_user = {
        "_id" : id,
        "username" : req.username,
        "password" : req.password
    }
    res.json(updated_user);
});

router.delete('user/:id', function(req, res) {
    var id = req.params.id;
    var deleted_user = User[id];
    delete deleted_user[id];
    res.json(deleted_user);
});

module.exports = router;