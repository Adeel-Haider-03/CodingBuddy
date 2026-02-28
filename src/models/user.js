const mongoose= require('mongoose');
const validator=require("validator")
const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt')

const userSchema = new mongoose.Schema({
    firstName: {                            //we can write like this also
        type: String,                   //   firstName: String, // String is shorthand for {type: String}
        required:true,
        minLength:3,
        maxLength:20
        
    },
    lastName: {
        type: String,
        required:true,
        minLength:3,
        maxLength:20
    },
    emailId: {
        type: String,
        unique:true,
        required:true,
        lowercase:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("please enter a valid email")
            }
        }
            
    },
    password: {
        type: String,
        required:true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Please enter a strong password")
            }
        }

    },
    age: {
        type: Number,
        min:18,
        
    },
gender:{
    type: String,
    validate(value){
            if(!["male","female","other"].includes(value)){
                throw new Error("Please enter a valid gender")
            }
        }
},
skills:{
    type:Array,
}

},{timestamps:true})

//schema method 
// we can use jwt sign method for user here to make clean more readeable

userSchema.methods.getJWT =async function(){
    const user=this;

    const token=jwt.sign({id:user._id},process.env.JWT_SECRET_KEY,{expiresIn:'1d'})

    return token;
}

userSchema.methods.validatePassword= async function (userInputPassword){
    const user =this;
    const isvalidPassword=await bcrypt.compare(userInputPassword,user.password)

    return isvalidPassword  //since it is async function so it will return a promise, so where ever to use this remind to use await keyword otherwise it will skip whatever condition is
}

const User=mongoose.model('User',userSchema)

module.exports=User;