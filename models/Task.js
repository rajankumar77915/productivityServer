const mongoose = require("mongoose")

const TaskSchema=mongoose.Schema({
    title:{
        type:String,
        require:true
    },
    subTitle:{
        type:String,
        require:true
    },
    dateTime:{
        type:Date,
        default:Date.now()
    },
    status: [
        {
            date: {
                type: Date,
                
            },
            done: {
                type: Boolean,
                default: false
            }
        }
    ],
    scheduleType:{
        type:String,
        enum:['daily', 'weekly', 'monthly', 'specific date'],
        require:true,
    },
    dayOfWeek:[
        {
            type:String
        }
    ],
    dayOfMonth:{
        type:Number
    },
    selectedDateText:{
        type:String//i know u think i should be date but i am developer 
    },
    user:
        {
            type:mongoose.Schema.Types.ObjectId ,
             ref:"user"
        }
    
})

module.exports=mongoose.model ("Task" ,TaskSchema)