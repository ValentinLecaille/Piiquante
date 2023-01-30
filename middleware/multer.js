const multer = require('multer');

// middleware multer pour ajout d'une image (création d'une sauce)
const storage = multer.diskStorage({ 
    destination: 'images/', 
    filename: function (req, file, cb){
      cb(null, fncFileName(req, file))
}});

function fncFileName(req, file) {
    // on défini le nom que portera l'image dans la base de données
    const fileName =  `${file.originalname}`;
    file.fileName = fileName;
    return fileName;
};

const upload = multer({ storage: storage }); 

module.exports = { upload }; 