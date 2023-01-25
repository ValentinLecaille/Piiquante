const mongoose = require('mongoose');
const unlink = require("fs").promises.unlink;

// model Schema sauce

const sauceSchema = new mongoose.Schema ({
    userId: String,
    name: String,
    manufacturer: String,
    description: String, 
    mainPepper: String,
    imageUrl: String,
    heat: Number,
    likes: Number,
    dislikes: Number,
    usersLiked: [String],
    usersDisliked: [String],
});

const Sauce = mongoose.model('Sauce', sauceSchema);

// récupération des sauces après authentification (authentification fait dans la route)
function getSauces(req, res) { 
    Sauce.find({})
        .then(sauces => res.send(sauces))
        .catch(error => res.status(500).send( error ));
};

// accès à la page d'une sauce

function getSaucebyId(req, res) {
    const { id } = req.params;
    return Sauce.findById(id)
}

function getOneSauce(req, res) {
    getSaucebyId(req, res)
    .then((sauce) => responseForClient(sauce, res))
    .catch((err) => res.status(500).send(err));
};

// création d'une sauce

function createSauce(req, res) {
    const {body, file} = req;
    const {fileName} = file;
    const sauce = JSON.parse(body.sauce);
    const {name, manufacturer, description, mainPepper, heat, userId} = sauce;

    const item = new Sauce({
        userId: userId,
        name: name,
        manufacturer: manufacturer,
        description: description, 
        mainPepper: mainPepper,
        imageUrl: getImgUrl(req, fileName),  
        heat: heat,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],
    })
    item
        .save()
        .then((msg) => { 
            res.status(201).send({ msg });
        })
        .catch(console.error);
};

function getImgUrl(req, fileName) {
    return req.protocol + "://" + req.get("host") + "/images/" + fileName;
};

// suppression d'une sauce

function deleteOneSauce(req, res) {
    const { id } = req.params;

    Sauce.findByIdAndDelete(id)
        .then(imageDelete)
        .then((sauce) => responseForClient(sauce, res))
        .catch((err) => res.status(500).send({ message : err}));
};

// suppression de l'image localement

function imageDelete(sauce) {
    const imageUrl = sauce.imageUrl;
    const fileToDelete = imageUrl.split("/").at(-1);
    return unlink(`images/${fileToDelete}`)
        .then(() => { return sauce });
};

// modification d'une sauce

function modifySauce(req, res) {
    const { params: {id} } = req

    // vérification si une image est intégrée à la requête de modification
    const isNewImage = req.file != null
    const payload = buildPayload(isNewImage, req);

    Sauce.findByIdAndUpdate(id, payload)
        .then((resp) => responseForClient(resp, res))
        .then((sauce) => imageDelete(sauce))
        .catch((err) => console.error("PROBLEM:", err))

};

// fonction du payload, savoir s'il y a un changement d'image dans la requête

function buildPayload(isNewImage, req) {
    if (!isNewImage)
    return req.body
    const payload = JSON.parse(req.body.sauce)
    payload.imageUrl = getImgUrl(req, req.file.fileName) 
    return payload
};

// fonction de réponse après modification / suppression

function responseForClient(sauce, res) {
    if (sauce == null) {
        return res.status(404).send({ message: "not found in database"})
    }
        return Promise.resolve(res.status(200).send(sauce))
            .then(() => sauce)
} // retourne une promesse de la sauce, pour la suppression de l'image

// like de Sauces

function likeSauce(req, res) {
    const { like, userId } = req.body
    if (![1, -1, 0].includes(like)) 
    return res.status(403).send({ message: "valeur invalide"})

    // on récupère le produit
    getSaucebyId(req, res)
        .then((sauce) => updateVote(sauce, like, userId, res)) // on lance le update vote
        .then(item => item.save()) // on enregistre ce qui est retournée par incrementVote
        .then(back => responseForClient(back, res))
        .catch((err) => res.status(500).send(err));
};

function updateVote(sauce, like, userId, res) {
    // on vérifie si le like est bien égal à 0, 1 ou -1, et on lui retourne l'incrémentation
    if (like === 1 || like === -1 ) return incrementVote(sauce, userId, like)
    if (like === 0) return resetVote(sauce, userId, res)
}

function incrementVote(sauce, userId, like) {
    const {usersLiked, usersDisliked} = sauce;
    // si like est = 1, on veut push dans usersliked, sinon on cherche à push dans usersDisliked
    const votersId = like === 1 ? usersLiked : usersDisliked;
    if (votersId.includes(userId)) return sauce;
    votersId.push(userId);

    let voteUpdate;
    if (like = 1) {
        voteUpdate = sauce.likes
        sauce.likes = ++voteUpdate
    } else { // if like = -1
        voteUpdate = sauce.dislikes
        sauce.dislikes = ++voteUpdate
    };
    return sauce;
}

function resetVote(sauce, userId, res) {
    const {usersDisliked, usersLiked} = sauce

    // on vérifie si l'utilisateur a voté dans les deux tableaux
    if ([usersLiked, usersDisliked].every(tab => tab.includes(userId)))

    // si vote en like et dislike, on retourne une promesse rejetée, on l'envoie dans le .catch de likeSauce
    return Promise.reject("l'utilisateur a voté dans les deux tableaux");

    // on vérifie si l'userId est présent dans aucun des deux tableaux
    if (![usersLiked, usersDisliked].some(tab => tab.includes(userId)))
    return Promise.reject("l'utilisateur n'a voté dans aucun des deux tableaux");

    //à ce point, on est sûr que l'utilisateur est présent dans l'un des deux tableaux, on le cherche pour retirer
    if (usersLiked.includes(userId)) {
        --sauce.likes;
        sauce.usersLiked = sauce.usersLiked.filter(id => id !== userId)
    } else {
        --sauce.dislikes;
        sauce.usersDisliked = sauce.usersDisliked.filter(id => id !== userId)
    };
    return sauce;
};

// export

module.exports = { getSauces, createSauce, getOneSauce, getSaucebyId, deleteOneSauce, modifySauce, likeSauce };