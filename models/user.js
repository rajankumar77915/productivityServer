const mongoose=require("mongoose");
const userSchema =mongoose.Schema({
    name:{
        type:String,
        require:true,
        trim:true
    },
    email:{
        type:String,
        require:true,
        trim:true
    },
    password:{
        require:true,
        type:String
    },
})


module.exports=mongoose.model("user" ,userSchema)