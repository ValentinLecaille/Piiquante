const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

// database

mongoose.connect('mongodb+srv://ValentinL:VAL1997@cluster0.6rz0bbw.mongodb.net/test',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MonnodegoDB échouée !'));

mongoose.set('strictQuery', true);

// models

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
  });
userSchema.plugin(uniqueValidator);

const User = mongoose.model('User', userSchema); 

// export 

 module.exports = {mongoose, User};