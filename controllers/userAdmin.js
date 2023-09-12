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