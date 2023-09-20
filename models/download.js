const {Sequelize} = require('sequelize');

const sequelize = require('../util/database');

const download = sequelize.define('download',{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    url:Sequelize.STRING,

})

module.exports = download;