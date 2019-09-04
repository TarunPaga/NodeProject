const express = require('express')

require('./db/mongoose')
const users=require('./models/users')
const tasks=require('./models/tasks')
const userRouter=require('./routers/users')
const taskRouter=require('./routers/tasks')
const port=process.env.PORT || 3000
const app=new express() 

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)



app.listen(port,()=>{
    console.log(`listing on port `+port)
})