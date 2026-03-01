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
        //compound index (indexes make that query very fast)
    connectionRequestSchema.index({fromUserId:1,toUserId:1})  //1 means ascending order, -1 means descending order. we can use any one of them as it is just for searching purpose and it will not affect the result
    //e.g 
    //anydatabasecollection.index({name:1},{gpa:-1})                       

    //why should we not use index on every field? because it will take more space and it will also slow down the write operations as it has to update the index every time we insert or update a document. so we should use index only on those fields which are frequently used in search queries.

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