const express = require('express');

const jwt = require('jsonwebtoken');

const router = express.Router();

const expenseAdmin = require('../controllers/expenseAdmin');

router.post('/add-expense',expenseAdmin.authenticate,expenseAdmin.postAddExpense);

router.get('/get-expense',expenseAdmin.authenticate,expenseAdmin.getExpense);

router.get('/delete-expense/:id',expenseAdmin.getDeleteExpense);

module.exports = router;