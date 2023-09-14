
const User = require('../models/user');

const Razorpay = require('razorpay');

const jwt = require('jsonwebtoken');
const sequelize = require('../util/database');

exports.createPurchaseOrder = async (req,res,next)=>{
        console.log("oooooooooooooooooooooo")
        try{
            var rzp = new Razorpay({
                key_id:process.env.Razorpay_key_id,
                key_secret:process.env.Razorpay_key_secret
            })
            console.log(rzp)
            const amount = 4500;
            const result = await rzp.orders.create({amount:amount,currency:'INR'}, async (err,order)=>{
                console.log('wwwwwwwwww')
                if (err){
                    throw new Error(JSON.stringify(err));
                }
                try{
                    console.log("hey")
                    const order_item = await req.user.createOrder({
                        orderId:order.id,
                        status:'PENDING'
                    })
                    res.status(201).json({order, key_id:rzp.key_id});
                }
                catch(err){
                    console.log(err)
                }
                
            })
        }
        catch(err){
            console.log(err)
        }
}

exports.authenticate = async(req,res,next)=>{
    try{
        const token = req.headers.authurization;
        const id = await jwt.verify(token,'secretkey')
        const user = await User.findByPk(id.userId);
        req.user=user;
        next(); 
    }
    catch(err){
        console.log(err);
    }
}

exports.postUpdatePaymentStatus= async(req,res,next)=>{
    try{
        const order_id= req.body.orderId;
        const payment_id = req.body.paymentId;
        const status = req.body.status;
        const user = req.user;
        
        const order = await user.getOrders({where:{orderId:order_id}});
        order[0].purchaseId = payment_id;
        order[0].status = status;
        order[0].save();
        if (status!="FAILED"){
            user.isPremium=true
            user.save();
            res.status(201).json({msg:'success'});
        }
        else{
            user.isPremium=false
            user.save();
            res.status(500).json({msg:'failed'});
        }
    }
    catch(err){
        console.log(err)
    }
}

exports.getLeaderBoard = async (req,res,next)=>{
    try{
        const user = req.user;
        const users = await User.findAll({
            attributes: ['name', 'totalExpense'],
            order:[
                ['totalExpense','DESC']
            ]
        })
        console.log('here',users);
        res.status(200).json({users:users});
    }
    catch(err){
        console.log(err)
    }
}