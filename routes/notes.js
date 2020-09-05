const express = require('express'),
    router = express.Router({ mergeParams: true });
const mongoose = require('mongoose');
const myModule = require('../models/upload');
const upload = myModule.otherMethod;
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const Comment = require('../models/comment');
const user = require('../models/user');
const Class_name = require('../models/class');

let gfs;
const mongoURI = 'mongodb+srv://pranav:pranav@cluster0.4lvhi.mongodb.net/pranav?retryWrites=true&w=majority';

mongoose.connect(mongoURI);
// Create mongo connection
const conn = mongoose.createConnection(mongoURI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});
conn.once('open', () => {
    // Init stream
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
});


router.get('/', (req, res) => {
    res.render('landing');
});

router.get('/notes', isLoggedIn, (req, res) => {
    gfs.files.find().toArray((err, files) => {
        // Check if files
        if (!files || files.length === 0) {
            res.render('notes', { files: false });
        } else {
            files.map(file => {
                if (
                    file.contentType === 'image/jpeg' ||
                    file.contentType === 'image/png'
                ) {
                    file.isImage = true;
                } else {
                    file.isImage = false;
                }
            });

            Class_name.find({}, (err, class_name) => {
                if (err)
                    console.log(err);
                else {
                    res.render('notes', { files: files, classic: class_name, req: req });
                }



            });


            // console.log(classic);

        }
    });
});

router.get('/notes/uploads', isLoggedIn, (req, res) => {
    gfs.files.find().toArray((err, files) => {
        // Check if files
        if (!files || files.length === 0) {
            res.render('uploads', { files: false });
        } else {
            files.map(file => {
                if (
                    file.contentType === 'image/jpeg' ||
                    file.contentType === 'image/png'
                ) {
                    file.isImage = true;
                } else {
                    file.isImage = true;
                }
                // console.log(files);

            });

            res.render('uploads', { files: files });
        }
    });
});

// @route POST /upload
// @desc  Uploads file to DB
router.post('/upload', upload.single('file'), (req, res) => {
    // res.json({ file: req.file });
    console.log(req.file.filename);
    res.redirect(`/class/${req.file.filename}`);
});

// @route GET /files
// @desc  Display all files in JSON
router.get('/class/:filename', isLoggedIn, (req, res) => {

    var f_name = req.params.filename;
    var user_class = req.user.username;
    var class_name = req.user.class_name;
    newClass = { text: f_name, filename: user_class, class_name: class_name };
    // console.log(newClass);

    Class_name.create(newClass, (err, newlyCreated) => {
        if (err)
            console.log(err);
    });
    res.redirect('/notes');
});

router.get('/files', isLoggedIn, (req, res) => {
    gfs.files.find().toArray((err, files) => {
        // Check if files
        if (!files || files.length === 0) {
            return res.status(404).json({
                err: 'No files exist'
            });
        }


        files.forEach(element => {



            var f_name = element.filename;
            var user_class = req.user.username;
            var class_name = req.user.class_name;
            newClass = { text: f_name, filename: user_class, class_name: class_name };
            // console.log(newClass);

            Class_name.create(newClass, (err, newlyCreated) => {
                if (err)
                    console.log(err);
            });


        })

        // Files exist
        res.redirect('/notes');
    });
});

// @route GET /files/:filename
// @desc  Display single file object
let tappu;



router.get('/notes/:filename', isLoggedIn, (req, res) => {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
        // Check if file
        // console.log(file._id);
        if (!file || file.length === 0) {
            return res.status(404).json({
                err: 'No file exists'
            });
        }
        tappu = file;
        // console.log(file);
        // console.log(tappu);
        // File exists
        // return res.json(file);

        Comment.find({}, function (err, allComment) {
            if (err) {
                console.log(err);
            } else {
                res.render("show", { Comment: allComment, file: file, req: req });
            }
        });
    });
});


// @route GET /image/:filename
// @desc Display Image
router.get('/image/:filename', isLoggedIn, (req, res) => {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
        // Check if file
        if (!file || file.length === 0) {
            return res.status(404).json({
                err: 'No file exists'
            });
        }

        // Check if image
        if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
            // Read output to browser
            const readstream = gfs.createReadStream(file.filename);
            readstream.pipe(res);
            // console.log(tappu);
        } else {
            res.status(404).json({
                err: 'Not an image'
            });
        }
    });
});

// @route DELETE /files/:id
// @desc  Delete file
router.delete('/files/:id', (req, res) => {
    gfs.remove({ _id: req.params.id, root: 'uploads' }, (err, gridStore) => {
        if (err) {
            return res.status(404).json({ err: err });
        }

        res.redirect('/notes');
    });
});



function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

module.exports = router;