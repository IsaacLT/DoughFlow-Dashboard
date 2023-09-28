const express = require('express');
const router = express.Router();

// Import existing routers
const userRouter = require('./users'); 
const expenseRouter = require('./expenses');
const categoryRouter = require('./categories');
const budgetRouter = require('./budgets'); 

router.use('/api/v1', userRouter);
router.use('/api/v1', expenseRouter);
router.use('/api/v1', categoryRouter);
router.use('/api/v1', budgetRouter);

module.exports = router;