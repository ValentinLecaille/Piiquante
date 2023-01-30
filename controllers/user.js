const { User } = require('../mongo');
const bcrypt = require('bcrypt');
const jsonWebToken = require('jsonwebtoken');

// création d'un utilisateur - SIGNUP

async function newUser(req, res) { 
    // on récupère les informations fournies dans la requête (email + password)
    const email = req.body.email;
    const password = req.body.password;
    // on hache le mot de passe en passant la fonction prévue et l'objet password en paramètre
    const passHashed = await passHash(password);
    // on créé un nouvel utilisateur
    const user = new User ({ email, password: passHashed });
    
    user
        .save()
        .then(() => res.status(201).send ({ message: 'Utilisateur enregistré' }))
        .catch((err) => res.status(409).send({ message: 'Utilisateur non enregistré' + err}));
};

// hashage du password
 
function passHash(password){
    // on transforme la chaîone de caractère du password en clé de valeur
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds)
};

// connexion d'un utilisateur - LOGIN
 
async function loginUser(req, res){

    try {
    // on récupère les informations fournies dans la requête (email + password)
    const email = req.body.email;
    const password = req.body.password;
    // on cherche l'utilisateur dont les innformations ont été fournies
    const user = await User.findOne({ email: email });
    // on vérifie que le mot de passe est bien valide grâce à bcrypt
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
    const token = jsonWebToken.sign({email: email}, "troubadour", {expiresIn: "2 days"});
    return token;
};

// export

module.exports = { newUser, loginUser, createToken };