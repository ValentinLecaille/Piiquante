const dotenv = require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');

// imports

const { sauceRouter } = require('./routers/sauceRouter');
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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true  }));
app.use("/api/sauces", sauceRouter)

// routes

app.post("/api/auth/signup", newUser);
app.post("/api/auth/login", loginUser); 

// static

app.use('/images', express.static(path.join(__dirname, 'images')));

// export

module.exports = app;