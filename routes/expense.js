const express = require('express');

const router = express.Router();

const expenseAdmin = require('../controllers/expenseAdmin');

router.post('/add-expense',expenseAdmin.postAddExpense);

router.get('/get-expense',expenseAdmin.getExpense);

router.get('/delete-expense/:id',expenseAdmin.getDeleteExpense);

module.exports = router;