const mongoose = require("mongoose");
const env = require('./.env');
const uniqueValidator = require("mongoose-unique-validator");

// database
mongoose.connect(env.mdp,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

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