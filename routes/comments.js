const express = require("express");
const router = express.Router();

const Comment = require("../models/comments");
const Item = require("../models/items")

// router.get("/comments", (req, res) => {
//     const comment = new Comment({
//         text: "I am a test comment",
//         author: "Jhon Doe"
//     });

//     comment.save();

//     Item.findOne({ name: "Burger" }, (err, found) => {
//         console.log(comment);

//         found.comments.push(comment);
//         found.save();
//         res.send("Succusful in adding comment to burger");
//     });


// });

router.get("/items/:id/comments/new", (req, res) => {
    res.render("commentViews/addComment", { id: req.params.id });
});

router.post("/items/:id/comments", async (req, res) => {
    const comment = new Comment({
        text: req.body.comment,
        author: req.body.author
    });

    await comment.save();

    Item.findById(req.params.id, (err, founditem) => {
        founditem.comments.push(comment);
        founditem.save();
        res.redirect("/items/" + req.params.id);
    });

});

module.exports = router;