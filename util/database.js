const {Sequelize} = require('sequelize');

const sequelize = new Sequelize('expense-tracker-full-app','root','Cse&2088',{
    dialect:"mysql",
    host:"localhost"
})

module.exports = sequelize;