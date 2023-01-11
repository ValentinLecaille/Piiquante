const express = require('express');
const app = express();
const { newUser } = require('./controllers/user'); 
const { loginUser } = require('./controllers/user');

// middlewares

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
  }); 

// routes

app.post("/api/auth/signup", newUser);
app.post("/api/auth/login", loginUser); 

// export

module.exports = app;