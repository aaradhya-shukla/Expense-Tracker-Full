const express = require('express');

const bodyParser = require('body-parser');

var cors = require('cors');

const sequelize = require('./util/database');

const signUp = require('./routes/signUp');

const expenseManager = require('./routes/expense');

const User = require('./models/user');

const Expense = require('./models/expense');

const app = express();

app.use(bodyParser.json());

app.use(cors());

app.use('/user',signUp);

app.use('/expense',expenseManager);

User.hasMany(Expense);
Expense.belongsTo(User);

sequelize.sync().
then(()=>{
    app.listen(3000);
})
.catch(err=>console.log(err))