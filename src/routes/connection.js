const express=require('express')
const connectionRouter=express.Router();
const {userAuth}=require('../middlewares/userAuth');
const ConnectionRequest=require('../models/ConnectionRequest');
const User=require('../models/user');


connectionRouter.post('/sendConnection/:status/:toUserId',userAuth,async(req,res)=>{


    //we get user because we have attach user to request in middleware
    try {
        
    const fromUser=req.user

    const toUser=await User.findById(req.params.toUserId);   //find the user to whom connection request is to be sent
    if(!toUser){
        return res.status(404).send({message:"User not found"})
    }
    const status=req.params.status;                          //interested,ignored
       
    // if(fromUser._id.equals(toUser._id)){
    //         return res.status(400).send({message:"You cannot send connection request to yourself"})
    //     }

    const allowedStatus=["interested","ignored"]
    if(!allowedStatus.includes(status)){
        return res.status(400).send({message:"Invalid status type"})
    }

    const checkConnection=await ConnectionRequest.findOne({
        $or: [  //used to check multiple conditions to see if it satisfy any one of them
            {fromUserId:fromUser._id,toUserId:toUser._id},  //from user to other
            {fromUserId:toUser._id,toUserId:fromUser._id}   //from other to User
        ]
    })

    if(!checkConnection){
        return res.status(400).send({message:"Connection already exist"})
        }

    //create a connection request
    const connectionRequest=new ConnectionRequest({
        fromUserId:fromUser._id,
        toUserId:toUser._id,
        status:status
    })

    
      await connectionRequest.save();
    res.send({message:"Connection request sent successfully",connectionRequest})

    } catch (error) {
        res.send({message:error.message})
    }
    
    
    
})


connectionRouter.post('/respondConnection/:status/:requestId',userAuth,async(req,res)=>{

    try {

        
        const loggedInUser=req.user;
        const status=req.params.status;          
        const requestId=req.params.requestId;

        const allowedStatus=["accepted","rejected"]
        if(!allowedStatus.includes(status)){
            return res.status(400).send({message:"Invalid status type"})
        }

        const connectionRequest=await ConnectionRequest.findOne(
            {_id:requestId,
            toUserId:loggedInUser._id,
            status:"interested"
            }
        )

          console.log(connectionRequest)

        if(!connectionRequest){
            return res.status(404).send({message:"No Connection request not found"})
        }
    
            connectionRequest.status=status;
            await connectionRequest.save();
            res.send({message:"Connection request responded successfully",connectionRequest})
      

    } catch (error) {
        res.send({message:error.message})
    }
})






module.exports=connectionRouter;