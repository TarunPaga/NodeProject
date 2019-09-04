const express=require('express')
require('../db/mongoose')
const auth=require('../middleware/auth')
const tasks=require('../models/tasks')
const router= new express.Router()

router.post('/tasks',auth,async (req,res)=>{
    //const tas=new tasks(req.body)
    console.log(req.user)
    const tas=new tasks({
        ...req.body,
        owner:req.user._id
    })
    try{
    await tas.save()
    res.send(tas)
    }catch(error){
        res.status(400).send(error)
    }
})

router.get('/tasks',auth,async(req,res)=>{
    
    const match= {}
    const sort={}

    if(req.query.completed)
    {
        match.completed= req.query.completed===true
    }

    if(req.query.sortBy)
    {
        const parts=req.query.sortBy.split(':')
        sort[parts[0]]=parts[1]==='asc' ? 1 : -1
    }
    try{
       // const tas= await tasks.find({owner:req.user._id})
      await req.user.populate({
          path:'tasks',
          match,
          options:{
              limit:parseInt(req.query.limit),
              skip:parseInt(req.query.skip),
              sort
          }
      }).execPopulate()
       
        res.send(req.user.tasks)
    }catch(e){
        res.status(400).send(e+"error")
    }
})

router.get('/tasks/:id',auth,async (req,res)=>{
    const _id = req.params.id
    console.log(_id)
    try{
       // const tas= await tasks.findById(_id)
       const tas=await tasks.findOne({_id,owner:req.user._id.toString()})
        if (!tas){
            console.log(tas)
         return res.status(404).send("cannot find task")
        }
        res.send(tas)
    }catch(e){
        res.status(500).send(e+"-error")
    }
})
    router.patch('/tasks/:id',auth,async (req,res)=>{
        const updates=Object.keys(req.body)
        const allowedUpdates=['description','completed']
        const isValid=updates.every((update)=>allowedUpdates.includes(update))
    
        if(!isValid)
        return res.status(400).send("error in valid updates")
        const _id = req.params.id
        
        try{
            const tas= await tasks.findOne({_id,owner:req.user._id})  
            console.log(tas) 
            if (!tas){
               
             req.status(404).send("file not found")
            }
            updates.forEach((update)=>{
                //console(tas[update])
                tas[update]=req.body[update]
              

            })
            
            await tas.save()
            res.send(tas)
        }catch(error){
            res.status(500).send(error+"")
        }
    })
    router.delete('/tasks/:id',auth,async (req,res)=>{
        const _id = req.params.id
        console.log(req.params.id)
        try{
            const tas= await tasks.findByIdAndDelete(_id)
            if (!tas){
                console.log(tas)
             res.status(404).send()
            }
            res.send(tas)
        }catch(e){
            res.status(500).send(e+'')
        }
    })
module.exports=router