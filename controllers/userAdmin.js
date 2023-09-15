const { connect } = require('http2');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sequelize = require('../util/database');
exports.postSignUp=async (req,res,next)=>{
    const tr = await sequelize.transaction();
    try{
        
        let name = req.body.name;
        let email = req.body.email;
        let password = req.body.password;
        const hash = await bcrypt.hash(password,10)
        const user = await User.create({
            name:name,
            email:email,
            password:hash
        },{transaction:tr});
        await tr.commit();
        res.status(200).json({msg:"successfully signed in"});
    }
    catch(err){
        if (err.name==="SequelizeUniqueConstraintError"){
            res.status(500).json({msg:'user email id already exists'})
        }
        await tr.rollback();
        console.log(err)
    }
}

function generateToken(id){
    return jwt.sign({userId:id},'secretkey');
}

exports.postLogin= async (req,res,next)=>{
    try{
        let email = req.body.email;
        let password = req.body.password;
        const user = await User.findAll({where:{email:email}});
        if (user.length>0){
            const hash = await bcrypt.compare(password,user[0].dataValues.password)
            if (!hash){
                return res.status(401).json({msg:'wrong password'});
            }
            else{
                return res.status(200).json({userid:user[0],token:generateToken(user[0].id)});
            }
            
        }
        res.status(404).json({msg:'user not found'});
    }
    catch(err){
        console.log(err);
    }
}