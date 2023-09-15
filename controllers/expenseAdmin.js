const Expense = require('../models/expense');

const User = require('../models/user');

const jwt = require('jsonwebtoken');

const sequelize = require('../util/database');




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
    const tr1 = await sequelize.transaction();
    const tr2 = await sequelize.transaction();
    let {expense,description,category} = req.body;
    const id = req.userId.userId;
    try{
        
        const user = await User.findByPk(id);
        console.log(user)
        const exp = await user.createExpense({
            expense:expense,
            description:description,
            category:category
        },{transaction:tr1});
        user.totalExpense = user.totalExpense + + expense;
        await tr1.commit();
        await user.save({transaction:tr2});
        await tr2.commit();
        res.status(200).json({expenses:exp})
    }
    catch(err){
        console.log(err);
        await tr1.rollback();
        await tr2.rollback();
    }
    

}

exports.getDeleteExpense = async (req,res,next)=>{
    const tr = await sequelize.transaction();
    const tr1 = await sequelize.transaction();
    try{
        
        const id = req.params.id;
        const userId = req.userId.userId;
        const user = await User.findByPk(userId)
        const expense = await Expense.findByPk(id)
        // return console.log(req,user)
        user.totalExpense = user.totalExpense - expense.expense;
        
        await user.save({transaction:tr});
        await tr.commit();
        const del = await expense.destroy({transaction:tr1});
        await tr1.commit();
        res.status(200).json({msg:"successfully deleted"})
    }
    catch(err){
        console.log(err);
        await tr.rollback();
        await tr1.rollback();
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