const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sequelize = require('../util/database');
const brevo = require('@getbrevo/brevo');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/user');
const ForgotPasswordRequests = require('../models/password');
const path = require('path');
const { Transaction } = require('sequelize');
// exports.authenticate = async(req,res,next)=>{
//     try{
//         const token = req.headers.authurization;
//         const id = await jwt.verify(token,'secretkey')
//         const user = await User.findByPk(id.userId);
//         req.user=user;
//         next(); 
//     }
//     catch(err){
//         console.log(err);
//     }
// }

exports.postForgotPassword = async (req,res,next)=>{
    // const tr = await sequelize.transaction();
    // const tr1 = await sequelize.transaction();
    const email = req.body.email
    const user = await User.findOne({where:{email:email}});
    const uid = uuidv4()
    // return console.log(user)
    try{
        const pastPasswordRequest = await user.getForgotPasswordRequests();
        if (pastPasswordRequest.length>0){
            await pastPasswordRequest[0].destroy()
            // const tr = await tr.commit();
        }
        user.createForgotPasswordRequest({
            id:uid,
            isActive:true
        })
        // await tr.commit();
    } 
    catch(err){
    //    await tr.rollback();
       console.log(er)
    }   
    console.log(email)
    let defaultClient = brevo.ApiClient.instance;
    let apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.API_KEY;
    //return console.log(process.env.API_KEY)
    let apiInstance = new brevo.TransactionalEmailsApi();
    let sendSmtpEmail = new brevo.SendSmtpEmail();


    sendSmtpEmail.subject = "My {{params.subject}}";
    sendSmtpEmail.htmlContent = "<html><body><h1>Password Reset</h1><bR><p>{{params.mailBody}}<br>{{params.url}}</p></body></html>";
    sendSmtpEmail.sender = { "name": "Aaradhya", "email": "aaradhya.shukla229@gmail.com" };
    sendSmtpEmail.to = [
    { "email": `${email}`, "name": "sample-name" }
    ];
    sendSmtpEmail.replyTo = { "email": "example@brevo.com", "name": "sample-name" };
    sendSmtpEmail.headers = { "Some-Custom-Name": "unique-id-1234" };
    sendSmtpEmail.params = { "mailBody": "Hello click on the link below to reset your password", "subject": "Request to Reset Password" , "url":`http://localhost:3000/password/resetpassword/${uid}`};


    apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data) {
    console.log('API called successfully. Returned data: ' + JSON.stringify(data));
    }, function (error) {
    console.error(error);
    });



}

exports.getPasswordReset = async (req,res,next)=>{
    try{
        const uid = req.params.uid;
        const resetReq = await ForgotPasswordRequests.findByPk(uid);
        if (resetReq.isActive){
            res.sendFile(path.join(__dirname,'../','resetForm.html'),{Headers:{
                uid:uid
            }})
        }
    }
    catch(err){
        console.log(err);
    }
}



exports.postUpdatePassword = async (req,res,next)=>{
    const tr = await sequelize.transaction();
    const tr1 = await sequelize.transaction();
    try{
        const {email,newPassword} = req.body;
        const hash = await bcrypt.hash(newPassword,10);
        const user = await User.findOne({where:{email:email}});
        user.password = hash
        await user.save({
            transaction:tr
        });
        await tr.commit();
        const ForgotPassword = await ForgotPasswordRequests.findOne({
            where:{
                userId:user.id
            }
        })

        ForgotPassword.isActive = false;
        await ForgotPassword.save({
            transaction:tr1
        })
        await tr1.commit();
    }
    catch(err){
        console.log(err)
        await tr.rollback();
        await tr1.rollback();
    }
}