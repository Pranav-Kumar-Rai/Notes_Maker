const express = require('express'),
    router = express.Router({ mergeParams: true });
const Comment = require('../models/comment');


router.get('/comment/:filename', isLoggedIn, (req, res) => {

    res.render('new', { filename: req.params.filename });

});

router.post('/comment/:filename', (req, res) => {

    var text = req.body.text;
    const author = req.user.username;

    const filename = req.body.filename;

    const userId = req.user._id;

    const newComment = { text: text, author: author, filename: filename, userId: userId };
    // console.log(newComment);
    Comment.create(newComment, (err, newlyCreated) => {
        if (err)
            console.log(err);
        else res.redirect('/notes');
    });


});

router.delete('/notes/filename/:commentId', (req, res) => {
    console.log(req.params.commentId);
    Comment.findByIdAndRemove(req.params.commentId, (err) => {
        if (err) {
            res.redirect('back');
        }
        else {
            res.redirect('back');
        }
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
