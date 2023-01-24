const jwt = require('jsonwebtoken');

// MIDDLEWARE : vérification du token et authentification  de l'utilisateur

function validUser(req, res, next) {
    // on récupère le header authorization lors de la requête GET
    const headerToken = req.header("Authorization");
    if (headerToken == null) 
    return res.status(403).send ({ message: 'Invalide' });

    // on split pour enlever le bearer et garder le token uniquement
    const token = headerToken.split(" ")[1];
    if (token == null) return res.status(403).send({ message: 'Le token ne peut être nul' });
    // on décode le token pour vérifier la correspondance
    jwt.verify(token, "troubadour", (err, decodedToken) => {
        if (err) return  res.status(403).send({ message: 'token invalide' + err });
        next(); 
    });
}; 

module.exports = { validUser };