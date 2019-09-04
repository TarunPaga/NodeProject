const express=require('express')
const multer = require('multer')
const sharp = require('sharp')
require('../db/mongoose')
const users=require('../models/users')
const auth=require('../middleware/auth')


const upload=new multer({
    
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpeg|jpg|png)$/)){
    return cb( new Error('please upload jpg ,jpeg or png  file') ) 
    }
    cb(undefined,true)
    }
   
})

const router=new express.Router()
router.post('/users/login', async (req,res)=>{
    try{
    const user=await users.findByCredentials(req.body.email,req.body.password)
   const token=await user.getWebTokens()
    res.send({user,token})
    }catch(e){
    res.status(500).send(e+"- error")
    }
})
router.post('/users',async (req,res)=>{
    const user = new users(req.body)
    try{
        
        await user.save()
        const token= await user.getWebTokens()
        res.status(201).send({user,token})
    }catch(e){
        res.status(500).send(e)
    }
    })
    // router.get('/users',auth,async (req,res)=>{
       
    //     try{
    //      const user= await users.find({})
    //      res.status(201).send(user)
    //     }catch(e){
    //      res.status(400).send(e)
    //  }
    //  })

    router.post('/users/logout',auth,async(req,res)=>{
        try{
            req.user.tokens=req.user.tokens.filter((token)=>{
                return token.token!==req.token
            })
            console.log(req.user.tokens)
            await req.user.save()
            res.send("user has been logged out successfully"+" "+req.token)

        }catch(e){
           res.status(500).send(e+"error") 
        }
    })
    router.post('/users/logoutALL',auth,async(req,res)=>{
        try{
            req.user.tokens=[]
            await req.user.save()
            res.status(200).send(" logged out successfully")

        }catch(e){
           res.status(500).send(e) 
        }
    })






    router.get('/users/me',auth,async (req,res)=>{
       res.send(req.user)
      
    })
    // router.get('/users/:id',async(req,res)=>{
    //     const _id = req.params.id
    //     try{
    //     const user= await users.findById(_id)
    //         if (!user){
    //            req.status(404).send()
    //         }
    //         res.send(user)
    //     }catch(e){
    //         res.status(500).send(e)
    //     }
    // })
    
    router.patch('/users/me',auth,async(req,res)=>{
        const updates=Object.keys(req.body)
        const allowedUpdates=['name','email','password','age']
        const isValid=updates.every((update)=>allowedUpdates.includes(update))
    
        if(!isValid)
        return res.status(400).send("error in valid updates")
        const _id = req.user._id
        try{
       // const user= await users.findByIdAndUpdate(_id,req.body,{new:true,runValidators:true})
        // const user = await users.findById(_id)
        //     if (!user){
        //      return  req.status(404).send()
        //     }
            
            updates.forEach((update)=>{
                req.user[update]=req.body[update]
            })

            await req.user.save()
          

            res.send(req.user)
        }catch(e){
            res.status(500).send(e+"error")
        }
    })
    
    // router.delete('/users/:id',async(req,res)=>{
    //     const _id = req.params.id
    //     try{
    //     const user= await users.deleteById(_id)
    //         if (!user){
    //            req.status(404).send()
    //         }
    //         res.send(user)
    //     }catch(e){
    //         res.status(500).send(e)
    //     }
    // })

    router.delete('/users/me',auth,async(req,res)=>{
        const _id = req.user._id
        try{
        // const user= await users.deleteById(_id)
        //     if (!user){
        //        req.status(404).send()
        //     }
            req.user.remove()
            res.send(req.user)
        }catch(e){
            res.status(500).send(e+"-error")
        }
    })


    router.post('/users/me/avatar',auth,upload.single('avatar'),async(req,res)=>{
        const buffer = await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
        req.user.avatar=buffer
       await  req.user.save()
        res.send("image uploaded successfully")

    },
    (error,req,res,next)=>{
        res.status(400).send({
            error:error.message
        })
    })

    router.get('/users/:id/avatar',async(req,res)=>{
        try{
    const user = await users.findById(req.params.id)
    console.log(user)
     if(!user || !user.avatar){
       throw new Error("user or user DP not found")
     }
    console.log('in')
    res.set('Content-Type','image/png')
    res.send(user.avatar)
   
        }catch(e)
        {   
         res.send(e)
        }
    })
        router.delete('/users/me/avatar',auth,async (req,res)=>{
            if(req.user.avatar===undefined)
            {
                throw new Error("no image to delete")
            }
            req.user.avatar=undefined
            await req.user.save()
            res.send("image deleted successfully")

       
    })
    module.exports=router