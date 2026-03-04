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
        }).populate('fromUserId','firstName lastName')

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
        }).populate('toUserId','firstName lastName')   //here we populating (getting info bcoz we have used ref in fromUserid in Model) the fromUserId field to get the firstName and lastName of the user who sent the request.
        //.popoulate('toUserId','[firstName,lastName]')  both syntax are correct, we can specify fields we want, if we don't it will give whole user object




        res.send({message:"Your all sent requests that are pending",
            data:pendingRequests
        })
    } catch (error) {
        res.status(500).send({message:error.message})
    }


})


userRouter.get('/user/requests/friends',userAuth, async (req, res) => {

    try {
        
        const SAFE_DATA=[ "firstName","lastName","email","age","gender",'skills']  //we will only send these fields to the client and not the whole user object (for security reasons)


        const loggedInUser=req.user;
        const friends= await ConnectionRequest.find({
            $or:[
                {fromUserId:loggedInUser._id,status:"accepted"},
                {toUserId:loggedInUser._id,status:"accepted"}
            ]
        }).populate('toUserId fromUserId',SAFE_DATA)

        //we need both reference bcoz either we had sent request( mean i am fromUserId) or we had recieved request (mean i am toUserId) so we need to populate both reference to get the details of friend in both cases. and we will only send the safe data to the client.

        const data=friends.map((friend)=>{
            // if(loggedInUser._id===friend.fromUserId._id){    // we cannot compare mongoose object directly with === operator, we need to use equals() method to compare the object ids. bcoz they are not primitive data types, they are objects. so we need to use equals() method to compare them. or we can use toString() method to convert them to string and then compare them. but equals() method is more efficient than toString() method.
                    

            if(friend.fromUserId._id.equals(loggedInUser._id)){     //bcoz we want only user detail of friend not us
                return friend.toUserId
            }
            else{
                return friend.fromUserId
            }
        })

        res.send({message:"Your all friends",data})


    } catch (error) {
        res.status(500).send({message:error.message})
    }



})

module.exports=userRouter
