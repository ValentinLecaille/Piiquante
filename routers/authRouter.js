const express = require("express");
const authRouter = express()

// imports
const { newUser, loginUser } = require('../controllers/user'); 

//routes
authRouter.post("/signup", newUser);
authRouter.post("/login", loginUser);

//exports
module.exports = {authRouter};