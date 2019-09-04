const mongoose=require('../src/db/mongoose')
const tasks=require('../src/models/tasks')
console.log("hello")
// tasks.findByIdAndDelete('5d5c3724bc77f5438cdd5c4d').then((result)=>{
//     console.log(result)
//   return tasks.countDocuments({
//        completed:false
//    })
// }).then((result)=>{
   
//     console.log(result)
// }).catch((e)=>{
//     console.log(e)
// })

const deleteTask=async (id)=>{
    const task= await tasks.findByIdAndDelete(id)
    const task2= await tasks.countDocuments({completed:false})
    return task2

}

deleteTask('5d5d2e607743d5b28b9b0816').then((result)=>{
    console.log(result)
}).catch((e)=>{
    console.log(e)
})