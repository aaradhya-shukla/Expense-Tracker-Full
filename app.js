const express = require('express');

require('dotenv').config();

const bodyParser = require('body-parser');

var cors = require('cors');

const helmet = require('helmet');

const morgan = require('morgan');

const fs = require('fs');

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

const path = require('path');

const app = express();

const accessLogStream = fs.createWriteStream(path.join(__dirname,'access.logs'),{flags:'a'});

app.use(helmet());

app.use(morgan('combined',{stream:accessLogStream}));

app.use(bodyParser.json());

app.use(cors());

app.use('/user',signUp);

app.use('/expense',expenseManager);

app.use('/purchase',razorpayHandler)

app.use('/password',passwordManager);

app.use((req,res)=>{
    res.sendFile(path.join(__dirname,`public/${req.url}`))
})

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
    app.listen(process.env.PORT);
})
.catch(err=>console.log(err))