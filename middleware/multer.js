const multer = require('multer');

const storage = multer.diskStorage({ 
    destination: 'images/', 
    filename: function (req, file, cb){
      cb(null, fncFileName(req, file))
}});

function fncFileName(req, file) {
    const fileName =  `${file.originalname}`;
    file.fileName = fileName;
    return fileName;
};

const upload = multer({ storage: storage }); 

module.exports = { upload }; 