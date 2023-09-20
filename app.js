const express = require('express');

require('dotenv').config();

const bodyParser = require('body-parser');

var cors = require('cors');

const sequelize = require('./util/database');

const signUp = require('./routes/signUp');

const expenseManager = require('./routes/expense');

const razorpayHandler = require('./routes/purchase');

const passwordManager = require('./routes/passwordReset');

const User = require('./models/user');

const Expense = require('./models/expense');

const Order = require('./models/orders');

const ForgotPasswordRequests = require('./models/password');

const Download = require('./models/download');

const app = express();

app.use(bodyParser.json());

app.use(cors());

app.use('/user',signUp);

app.use('/expense',expenseManager);

app.use('/purchase',razorpayHandler)

app.use('/password',passwordManager);

User.hasMany(Expense);
Expense.belongsTo(User);
User.hasMany(Order);
Order.belongsTo(User);
User.hasMany(ForgotPasswordRequests);
ForgotPasswordRequests.belongsTo(User);
User.hasMany(Download);
Download.belongsTo(User);


sequelize.sync().
then(()=>{
    app.listen(3000);
})
.catch(err=>console.log(err))