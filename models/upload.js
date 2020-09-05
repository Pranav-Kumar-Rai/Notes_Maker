const mongoose = require('mongoose');
const GridFsStorage = require('multer-gridfs-storage');
const multer = require('multer');
const Grid = require('gridfs-stream');
const mongoURI = 'mongodb+srv://pranav:pranav@cluster0.4lvhi.mongodb.net/pranav?retryWrites=true&w=majority';
const crypto = require('crypto');
const path = require('path');


let gfs;


const storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,

                    bucketName: 'uploads'
                };
                resolve(fileInfo);
            });
        });
    }
});
const upload = multer({ storage });



module.exports = {
    method: gfs,
    otherMethod: upload,
};