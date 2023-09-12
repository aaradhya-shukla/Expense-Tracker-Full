const { connect } = require('http2');
const User = require('../models/user');

exports.postSignUp=async (req,res,next)=>{
    try{
        let name = req.body.name;
        let email = req.body.email;
        let password = req.body.password;
        const user = await User.create({
            name:name,
            email:email,
            password:password
        });
        res.status(200).json({msg:"successfully signed in"});
    }
    catch(err){
        if (err.name==="SequelizeUniqueConstraintError"){
            res.status(500).json({msg:'user email id already exists'})
        }
        
        console.log(err)
    }
}

exports.postLogin= async (req,res,next)=>{
    try{
        let email = req.body.email;
        let password = req.body.email;
        const user = await User.findAll({where:{email:email}});
        if (user.length>0){
            if (user[0].dataValues.password!=password){
                return res.status(404).json({msg:'wrong password'});
            }
            else{
                return res.status(200).json({user:user[0]});
            }
            
        }
        res.status(404).json({msg:'user not found'});
    }
    catch(err){
        console.log(err);
    }
}