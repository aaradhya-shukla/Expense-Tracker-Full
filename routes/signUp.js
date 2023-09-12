const express = require('express');

const router = express.Router();

const userAdmin = require('../controllers/userAdmin');

router.post('/signUp',userAdmin.postSignUp);

module.exports=router;