const Comment = require("../models/comments");

const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect("/login")
    }
}

const checkAdminAuthorization = (req, res, next) => {
    if (req.isAuthenticated()) {
        if (req.user.username === "admin") {
            next();
        } else {
            req.logout();
            res.redirect("/login");
        }
    } else {
        res.redirect("/items");
    }

}

const checkCommentOwnership = (req, res, next) => {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.commentID, (err, foundComment) => {
            if (!err) {
                if (req.user._id.equals(foundComment.author.id)) {
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });

    } else {
        res.redirect("/login");
    }
}

module.exports = {
    isLoggedIn,
    checkAdminAuthorization,
    checkCommentOwnership
}