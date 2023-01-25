const express = require("express");
const authRouter = express();
const { validUser } = require('../middleware/validUser');

const { newUser, loginUser } = require('../controllers/user'); 

authRouter.post("/api/auth/signup", newUser);
authRouter.post("/api/auth/login", loginUser);

module.exports = { authRouter };