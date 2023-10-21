const express = require("express");
const router = express.Router();

const {signup} =require("../controller/Auth")
const {login}=require("../controller/login");
const { userUpdate } = require("../controller/userUpdate");
// const { isStudent, isAdmin, auth } = require("../middleware/auth");

// router.post("/login",login);
router.post("/signup",signup);
router.post("/login", login);
router.post("/update/:userId", userUpdate);






module.exports=router


