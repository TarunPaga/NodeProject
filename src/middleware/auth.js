const jwt= require('jsonwebtoken')
const users = require('../models/users')

const auth = async (req,res,next)=>{
   try{
    const token=req.header('Authorization').replace('Bearer ','')
    const decode= jwt.verify(token,'hello') ;console.log(decode)
    const user=await users.findOne({_id:decode._id,'tokens.token':token})
    if(!user)
    {
        throw new Error()
    }
    req.user=user
    req.token=token
    }catch(e){
        res.status(401).send(e)
    }  
    next()
}
module.exports=auth