const bcrypt=require("bcrypt");
const user=require("../models/user");
const { json } = require("express");


exports.signup = async (req, res) => {
    try {
      // Get data
      const { name, email, password} = req.body;

      // Check if the user already exists
      const existUser = await user.findOne({ email });
      if (existUser) {
        return res.status(404).json({
          success: false,
          message: "User already exists",
        });
      }
  
      // Do password hashing
      let hashedPassword;
      try {
        hashedPassword = await bcrypt.hash(password, 10);
      } catch (error) {
        return res.status(250).json({
          message: "Hash error",
          success: false,
          error: error.message,
        });
      }
  
    
  
      // Create entry for the user
      const newUser = await user.create({
        name,
        email,
        password: hashedPassword,
      });
      console.log(newUser)
  
      return res.status(200).json({
        success: true,
        message: "User successfully created",
        data: newUser,
      });
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: "Try again",
        data: req.body,
        error: error.message,
      });
    }
  };
  