const { User } = require('../mongo');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// création d'un utilisateur - SIGNUP

async function newUser(req, res) { 
    const email = req.body.email;
    const password = req.body.password;
    const passHashed = await passHash(password);
    const user = new User ({ email, password: passHashed });
  
    user
        .save()
        .then(() => res.status(201).send ({ message: 'Utilisateur enregistré' }))
        .catch((err) => res.status(409).send({ message: 'Utilisateur non enregistré' + err}));
};

// hashage du password
 
function passHash(password){
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds)
};

// connexion d'un utilisateur - LOGIN
 
async function loginUser(req, res){

    try {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({ email: email });

    const validPassword = await bcrypt.compare(password, user.password)
        if (!validPassword) {
            res.status(403).send({ message: 'mot de passe incorrect' })
        }
        const token = createToken(email);        
        if (validPassword) {
            res.status(200).send({ userId: user?._id, token: token })
        };

    } catch(err) {
        res.status(500).send({ message : "erreur interne" });
    }
};

// création d'un Token utilisateur

function createToken(email) {
    const token = jwt.sign({email: email}, "troubadour", {expiresIn: "2 days"});
    return token;
};

// export

module.exports = { newUser, loginUser, createToken };