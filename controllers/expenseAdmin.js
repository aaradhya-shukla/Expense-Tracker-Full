const Expense = require('../models/expense');

const User = require('../models/user');

exports.getExpense = async (req,res,next) =>{
    try{
        const id = req.query.id;
        const user = await User.findByPk(id);
        const expenses = await user.getExpenses();
        res.status(200).json({expenses:expenses});
    }
    catch(err){
        console.log(err)
    }
}

exports.postAddExpense = async (req,res,next) =>{
    console.log('heree')
    let {expense,description,category} = req.body;
    const id = req.query.id;
    console.log(id)
    try{
        const user = await User.findByPk(id);
        console.log(user)
        const exp = await user.createExpense({
            expense:expense,
            description:description,
            category:category
        })
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