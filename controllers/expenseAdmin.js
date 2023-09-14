const Expense = require('../models/expense');

const User = require('../models/user');

const jwt = require('jsonwebtoken');



exports.getExpense = async (req,res,next) =>{
    try{
        const id = req.userId.userId;
        const user = await User.findByPk(id);
        const expenses = await user.getExpenses();
        res.status(200).json({expenses:expenses,user:user});
    }
    catch(err){
        console.log(err)
    }
}

exports.postAddExpense = async (req,res,next) =>{
    console.log('heree')
    let {expense,description,category} = req.body;
    const id = req.userId.userId;
    try{
        const user = await User.findByPk(id);
        console.log(user)
        const exp = await user.createExpense({
            expense:expense,
            description:description,
            category:category
        })
        user.totalExpense = user.totalExpense + + expense;
        user.save();
        res.status(200).json({expenses:exp})
    }
    catch(err){
        console.log(err)
    }
    

}

exports.getDeleteExpense = async (req,res,next)=>{
    try{
        const id = req.params.id;
        const expense = await Expense.findByPk(id)
        const del = await expense.destroy();
        res.status(200).json({msg:"successfully deleted"})
    }
    catch(err){
        console.log(err)
    }
}

exports.authenticate = async(req,res,next)=>{
    try{
        const token = req.headers.authurization;
        const id = await jwt.verify(token,'secretkey')
        req.userId=id;
        next(); 
    }
    catch(err){
        console.log(err);
    }
}