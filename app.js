const express = require("express");
const app = express();
const path = require('path');
const multer = require("multer");
require("dotenv").config();
const ejs = require('ejs');
const port = process.env.port;

// set storage engine
const storage = multer.diskStorage({
    destination: './public/image/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
})

// upload file
const upload = multer({
    storage: storage,
    limits: { fileSize: 8000000 },      
    fileFilter: (req, file, cb) => {
        if ( file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true)
        } else {
            cb(null, true)
            return cb(new Error(' only jpg and jpeg file is valid for upload...'));
        }
    }
}).single('myImage');

app.set('view engine', 'ejs');
app.use(express.static("./public"));

app.get('/', (req, res) => {
    res.render('index')
});

app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.render('index', {
                msg: err
            });
        } else {
            if (req.file == undefined) {
                res.render('index', {
                    msg: 'Error : No file selected'
                });
            } else {
                res.render('index', {
                    msg: 'file uploaded',
                    file: `image/${req.file.filename}`
                })
            }
        }
    })
})

app.listen(port, (req, res) => {
    console.log(`your ${port} is running successfully...`);
});