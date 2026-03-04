const express=require('express');
const userRouter=express.Router();
const {userAuth}=require('../middlewares/userAuth');
const ConnectionRequest = require('../models/connectionRequest');

userRouter.get('/user/requests/recieved',userAuth, async (req, res) => {

    try {
        const loggedInUser=req.user;
        const requests= await ConnectionRequest.find({
            toUserId:loggedInUser._id,
            status:"interested"
        })
        
        res.send({message:"Connection requests fetched successfully",requests})
    } catch (error) {
        res.status(500).send({message:error.message})    }






})


userRouter.get('/user/requests/sent',userAuth, async (req, res) => {

    try {
        const loggedInUser=req.user;
        const pendingRequests= await ConnectionRequest.find({
            fromUserId:loggedInUser._id,
            status:"interested"
        })




        res.send({message:"Your all sent requests that are pending",
            data:pendingRequests
        })
    } catch (error) {
        res.status(500).send({message:error.message})
    }


})


module.exports=userRouter
