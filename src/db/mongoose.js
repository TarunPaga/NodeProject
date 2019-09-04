const mongoose=require('mongoose')
const validator=require('validator')


mongoose.connect('mongodb://127.0.0.1/task-manager-api',{
    useNewUrlParser:true,
    useCreateIndex:true
})      
// const tarun = new User({
//     name:'Akshay karnam',
//     email:'tjpaga@gmail.com',
//     age:23,
//     password:'hellohello'
// })  


// tarun.save().then(((result)=>{
//     console.log(result)
// })).catch((error)=>{
//     console.log(error)
// })

// const tasks=mongoose.model('tasks',{
//     description:{
//         type:String,
//         require:true,
//         trim:true,

//     },
//     completed:{
//         type:Boolean,
//         default:false
    

//     }

// })
// const ToDo=new tasks({
//     description:'wake up early',
//     completed:true
      
// })
// ToDo.save().then((result)=>{
//     console.log(result)
// }).catch((error)=>{
//     console.log(error)

// })
