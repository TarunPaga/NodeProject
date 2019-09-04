const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const tasks=require('../models/tasks')

const userSchema=mongoose.Schema({


    name:{
        type:String,
        require:true
    },
    password:{
        type:String,
        
        required:true,
        trim :true,
        validate(value){
            if(value.length<6)
            {
                throw new Error("password should be more then 6 letters")
            }else if(value.includes('password')){
                throw new Error("passord cannot be password")
            }

        }
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("email not correct ")
            }
        }
    },
    age:{
        type:Number,
        default:0,
        validate(value){
        if(value<0){
            throw new Error('age must be positive')
        }
    }

    },

    tokens:[{token: {
        type:"String",
        require:true
    }}],
    avatar:{
        type:Buffer
    }
  
}
,{
    timestamps:true
})

userSchema.virtual('tasks',{
    ref:'tasks',
    localField:'_id',
    foreignField:'owner'

})
userSchema.methods.toJSON=function (){
    const user=this
    const userObject=user.toObject()
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    return userObject
}
userSchema.methods.getWebTokens=async function(){
    const user =this
   
    const token=await jwt.sign({_id:user._id.toString()},'hello')
    user.tokens=user.tokens.concat({token})
    await user.save()
    return token


}

userSchema.statics.findByCredentials=async (email,password)=>{
    
    

    const user  =  await  User.findOne({email})
    
    if(!user){
    throw new Error("unable to login")
    }
    const isMatch= await bcrypt.compare(password,user.password)
  
    if(!isMatch){
        throw new Error("unable to login")
    }
    return user
    }
//user password before saving
userSchema.pre('save',async function(next){
    const user=this
    
   
    
    if(user.isModified('password')){
             user.password=await bcrypt.hash(user.password,8)
      
        next()
    }
})

    userSchema.pre('remove',async function(next){
        const user=this
        await tasks.deleteMany({owner:req.user._id})
        next()
    })

const User=mongoose.model('User',userSchema)
module.exports=User
