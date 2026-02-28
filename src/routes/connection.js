const express=require('express')
const router=express.Router();
const {userAuth}=require('../middlewares/userAuth');
const ConnectionRequest=require('../models/ConnectionRequest');
const User=require('../models/user');


router.post('/sendConnection/:status/:toUserId',userAuth,async(req,res)=>{
    //we get user because we have attach user to request in middleware
    try {
        
    const fromUser=req.user
    const toUser=await findOne(req.params.toUserId); //find the user to whom connection request is to be sent
    const status=req.params.status;                 //interested,ignored,accepted,rejected

    //create a connection request
    const connectionRequest=new ConnectionRequest({
        from:fromUser._id,
        to:toUser._id,
        status:status
    })

    } catch (error) {
        res.send({message:error.message})
    }
    
    await connectionRequest.save();
    res.send({message:"Connection request sent successfully",connectionRequest})
    
})


module.exports=router;