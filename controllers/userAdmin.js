const { connect } = require('http2');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sequelize = require('../util/database');
const brevo = require('@getbrevo/brevo');

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

exports.postForgotPassword = (req,res,next)=>{
    const email = req.body.email
    let defaultClient = brevo.ApiClient.instance;
    let apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.API_KEY_BREVO;
    let apiInstance = new brevo.TransactionalEmailsApi();
let sendSmtpEmail = new brevo.SendSmtpEmail();

sendSmtpEmail.subject = "My {{params.subject}}";
sendSmtpEmail.htmlContent = "<html><body><h1>Password Reset {{params.parameter}}</h1></body></html>";
sendSmtpEmail.sender = { "name": "Aaradhya", "email": "aaradhya.shukla229@gmail.com" };
sendSmtpEmail.to = [
  { "email": `${email}`, "name": "sample-name" }
];
sendSmtpEmail.replyTo = { "email": "example@brevo.com", "name": "sample-name" };
sendSmtpEmail.headers = { "Some-Custom-Name": "unique-id-1234" };
sendSmtpEmail.params = { "parameter": "hey I am aaradhya", "subject": "Request to Reset Password" };


apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data) {
  console.log('API called successfully. Returned data: ' + JSON.stringify(data));
}, function (error) {
  console.error(error);
});



}