const mongoose =require('mongoose')

const connectionRequestSchema= new mongoose.Schema(
    {
        fromUserId:{
            type:mongoose.Schema.Types.ObjectId,
            required:true
        },

        toUserId:{
            type:mongoose.Schema.Types.ObjectId,
            required:true
        },

        status:{
            type:String,
            required:true,
            enum:{
                values:["interested","accepted","ignored","rejected"],
                message:`{VALUE} is incorrect status type`
            }
        }

    },{timestamps:true}
)

    //schema level validation to ensure that only one connection request can be sent from one user to another

    //connectionRequestSchema.index({fromUserId:1,toUserId:1},{unique:true})  //to ensure that only one connection request can be sent from one user to another
    
    //schema level validation to ensure that a user cannot send connection request to himself

    connectionRequestSchema.pre('save', function(next) {  //pre check before saving the document (e.g here connection.save())
        const connectionRequest = this;
        if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
            throw new Error("You cannot send connection request to yourself")
        }
        next();
    })

const ConnectionRequestModel= mongoose.model('connectionRequest',connectionRequestSchema)

module.exports=ConnectionRequestModel