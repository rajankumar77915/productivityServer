const express = require("express")
const mongoose = require("mongoose")
const user = require("../models/user")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

//i want to secreat key so thats why i need to import env
require("dotenv").config();

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(email,password)
        console.log(email)
        const existUser = await user.findOne({ email });
        if (!existUser) {
            res.status(400).json({
                stutus: false,
                message: "user not exist"
            })
        }
        else {
            // const b = ;
            const payload = {//it's body/content that i want to use in token
                email: existUser.email,
                id: existUser._id,
                role: existUser.role
            };
            // console.log(bcrypt.compareSync(password, existUser.password), existUser.password  ,password)
            if (await bcrypt.compareSync(password, existUser.password)) {

                //create own tocken
                let token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "100s" })
                existUser.token = token;
                existUser.password = undefined;
                //for cookie
                const options = {
                    expires: new Date(Date.now() + 100000),
                    httpOnly: true,
                }
                console.log("sucees")
                res.cookie("rajan Cookie", token, existUser).status(200).json({
                    message: "sucessfully added",
                    token,
                    existUser
                });
            }
            else
           
                res.status(501).json({
                    message: "sucessfully not.. login",
                    data: existUser
                })
        }
    }
    catch (error) {
        res.status(250).json({
            error: error.message,
            message: "try again"
        })
    }

}