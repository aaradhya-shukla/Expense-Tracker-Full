const {Sequelize} = require('sequelize');

const sequelize = require('../util/database');

const Order = sequelize.define('order',{

    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    purchaseId:Sequelize.STRING,
    status:Sequelize.STRING,
    orderId:Sequelize.STRING
})

module.exports = Order;