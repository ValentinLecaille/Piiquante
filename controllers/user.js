const { User } = require('../mongo');
const bcrypt = require('bcrypt');

async function newUser(req, res) { 
    const email = req.body.email;
    const password = req.body.password;

    const passHashed = await passHash(password);

    console.log('password:', password);
    console.log('passHashed:', passHash);

    const user = new User ({ email, password: passHashed });
  
    user
        .save()
        .then(() => res.status(201).send ({ message: 'Utilisateur enregistré' }))
        .catch((err) => res.status(409).send({ message: 'Utilisateur non enregistré' + err}));
}
 
function passHash(password){
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds)
}

async function loginUser(req, res){
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({ email: email });

    const validPassword = await bcrypt.compare(password, user.password)
        if (!validPassword) {
            res.status(403).send({ message: 'mot de passe incorrect' })
        }
        if (validPassword) {
            res.status(200).send({ message: 'identification réussie' })
        };

    console.log('user:', user);
    console.log('validPassword:', validPassword);
}

// export

module.exports = { newUser, loginUser };