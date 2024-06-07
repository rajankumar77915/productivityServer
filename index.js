
const express =require("express");
const app=express();

//load config fromEnv
require("dotenv").config();
const PORT=process.env.PORT || 4000;
process.env.TZ = 'Asia/Kolkata';
//middleware to pass jsong request body
app.use(express.json());

//import routes for TOGO API
const user=require("./routes/user");
const task=require('./routes/task')
//mount
 app.use("/api/v1/user",user);
 app.use("/api/v1/task",task);

 app.listen(PORT,()=>{
    console.log(`at ${PORT}`);
 })

require("./config/database").dbConnect();


 //default route
 app.get("/",(req,res)=>{
    res.send(`Server is running...`);
 })
