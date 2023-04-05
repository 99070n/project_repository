var express = require('express');
var path = require('path');
var router = express.Router();
var multer = require('multer')

var tesseract = require("node-tesseract-ocr");

//storage 
var storage_data = multer.diskStorage({
  destination: function (req, file, done) {
    done(null, "./public/images");
  },
  filename: function (req, file, done) {
    done(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

var upload = multer({storage:storage_data})

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index',{data:''})
});

//post
router.post('/captcha', upload.single('file'), (req, res) => {
   

  const config = {
    lang: "eng",
    oem: 1,
    psm: 3,
  };

  tesseract
    .recognize(req.file.path, config)
    .then((text) => {
        console.log("Result:", text);
        
        res.render('index',{data:text})
    })
    .catch((error) => {
      console.log(error.message);
    });
})
module.exports = router;
