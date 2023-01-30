const express = require("express");
const sauceRouter = express()
const { upload } = require('../middleware/multer');
const { validUser } = require('../middleware/validUser');

// imports
const { getSauces, createSauce, getOneSauce, deleteOneSauce, modifySauce, likeSauce } = require('../controllers/sauces');

// routes
sauceRouter.get("/", validUser, getSauces);
sauceRouter.post("/", validUser, upload.single('image'), createSauce);
sauceRouter.put("/:id", validUser, upload.single('image'), modifySauce);
sauceRouter.get("/:id", validUser, getOneSauce);
sauceRouter.delete("/:id", validUser, deleteOneSauce);
sauceRouter.put("/:id", validUser, upload.single('image'));
sauceRouter.post("/:id/like", validUser, likeSauce)

// exports
module.exports = { sauceRouter };