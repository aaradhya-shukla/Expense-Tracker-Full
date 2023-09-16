const express = require('express');

const router = express.Router();

const userAdmin = require('../controllers/userAdmin');

router.post('/signUp',userAdmin.postSignUp);

router.post('/login',userAdmin.postLogin);

router.post('/forgotpassword',userAdmin.postForgotPassword)

module.exports=router;