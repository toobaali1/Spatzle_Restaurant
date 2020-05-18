const express = require("express");
const router = express.Router();

const Comment = require("../models/comments");
const Item = require("../models/items")
const { isLoggedIn } = require("../middleware/auth");

router.get("/items/:id/comments/new", isLoggedIn, (req, res) => {
    Item.findById(req.params.id, (err, foundItem) => {
        res.render("commentViews/addComment", { foundItem });
    });
});

router.post("/items/:id/comments", isLoggedIn, async (req, res) => {
    const comment = new Comment({
        text: req.body.comment,
        author: {
            id: req.user._id,
            username: req.user.username
        }
    });

    await comment.save();

    Item.findById(req.params.id, (err, foundItem) => {
        foundItem.comments.push(comment);
        foundItem.save();
        res.redirect("/items/" + req.params.id);
    });

});

module.exports = router;