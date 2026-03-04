const express = require('express');
const connectDB = require('./config/database');
const cookieParser = require('cookie-parser')
const User=require('./models/user')

const app = express();

app.use(express.json());

app.use(cookieParser())

const authRouter=require('./routes/auth')
const profileRouter=require('./routes/profile')
const connectionRouter=require('./routes/connection')
const userRouter=require('./routes/userRequests')

app.use('/',authRouter)
app.use('/',profileRouter)
app.use('/',connectionRouter)
app.use('/',userRouter)


// app.get('/getUser',async(req,res)=>{
//     try {
//         //find all documents
//      //   const users=await User.find({});

//     //return all documents with specific thing
//    // const users=await User.find({emailId:"adeel@gmail.com"})
//    //return one document
// //    const user = await User.findOne({lastName:"Haider"})
// //         res.send(user)

// const email=req.body.emailId
// const user=await User.findOne({emailId:email})
// res.send(user)
//     } catch (error) {
//         res.send("error fetching users")
//     }
// })

connectDB()
.then(()=>{
    console.log("Database connected successfully");
    app.listen(3000,()=>{
    console.log("Server is running on port 3000");
})
})
.catch((err)=>{
    console.error("Database connection failed", err);
});


