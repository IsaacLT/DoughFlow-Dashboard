const express = require("express");
const router = express.Router();
const Category = require('../models/category');

router.post('/categories', async function (req, res) {
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
});

router.get('/categories', async function (req, res) {
    const categories = await Category.find({});
    if(categories.length == 0) {
        res.status(404).json({message: "No categories found"});
    } else {
    res.json(categories);
    }
});

router.get('/categories/:id', async function (req, res) {
    const id = req.params.id;
    // Query the database to retrieve a category by category name
    const category = await Category.findOne({_id: id});
    if (!category) {
    return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
});

router.patch('/categories/:id', async function (req, res) {
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
});

router.delete('/categories/:id', async function(req, res) {
    const id = req.params.id;
    // Query the database to retrieve a category by ID
    const category = await Category.findOne({_id: id});
    if (!category) {
        return res.status(404).json({ message: 'Category not found' });
    } 
    await Category.deleteOne(category);
    res.json({message: 'Category deleted succesfully'});
});

module.exports = router;