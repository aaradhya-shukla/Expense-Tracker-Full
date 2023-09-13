const {Sequelize} = require('sequelize');

const sequelize = require('../util/database');


const Expense = sequelize.define('expense',{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    expense:Sequelize.INTEGER,
    description:Sequelize.STRING,
    category:Sequelize.STRING,
})

module.exports = Expense;