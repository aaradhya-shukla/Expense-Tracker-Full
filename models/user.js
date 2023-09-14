const {Sequelize} = require('sequelize');

const sequelize = require('../util/database');

const User = sequelize.define('user',{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    name:Sequelize.STRING,
    email:{
        unique:true,
        type:Sequelize.STRING
    },
    password:Sequelize.STRING,
    isPremium:{
        type:Sequelize.BOOLEAN,
        defaultValue:false
    }

})

module.exports = User;
