const express = require("express");
const router = express.Router();

const {signup} =require("../controller/Auth")
const {login}=require("../controller/login");
// const { isStudent, isAdmin, auth } = require("../middleware/auth");

// router.post("/login",login);
router.post("/signup",signup);
router.post("/login",login);






module.exports=router


