const { Sequelize } = require("sequelize")

const sequelize = require('../util/database');

const ForgotPasswordRequests = sequelize.define('ForgotPasswordRequest',{
    id:{
        type:Sequelize.STRING,
        allowNull:false,
        unique:true,
        primaryKey:true
    },
    isActive:Sequelize.BOOLEAN
})

module.exports = ForgotPasswordRequests;