const express = require("express");
const router = express.Router();

const Category = require("../models/category");
const Item = require("../models/items");
const Comment = require("../models/comments");
const ObjectID = require('mongodb').ObjectID;

const { checkAdminAuthorization } = require("../middleware/auth");

// show new category form
router.get("/category/new", checkAdminAuthorization, (req, res) => {
    Category.find({}, (err, foundCats) => {
        res.render("categoryViews/addCat", { foundCats });

    });
});

// Add new category
router.post("/category", checkAdminAuthorization, async (req, res) => {
    const cat = new Category({
        name: req.body.name
    });

    await cat.save();
    res.redirect("/category/new");
});

// show update category form
router.get("/category/:id/edit", checkAdminAuthorization, (req, res) => {
    Category.findById(req.params.id, (err, foundCat) => {
        res.render("categoryViews/editCat", { foundCat });

    });
});

// Update Category
router.put("/category/:id", checkAdminAuthorization, (req, res) => {
    Category.findByIdAndUpdate(req.params.id, { name: req.body.name }, (err, updatedCat) => {
        if (!err) {
            res.redirect("/category/new");
        }
    });
    console.log("old name is ", req.body.oldName);

    Item.find({ category: req.body.oldName }, (err, foundItems) => {
        foundItems.forEach((item) => {
            console.log("item.cat is", item.category, "and new name is ", req.body.name);
            item.category = req.body.name;
            item.save()

        });
    });
});

// Delete Category
router.delete("/category/:id", checkAdminAuthorization, (req, res) => {

    Category.findById(req.params.id, (err, foundCat) => {
        // delete comments
        Item.find({ category: foundCat.name }, async (err, foundItems) => {
            await foundItems.forEach((foundItem) => {
                foundItem.comments.forEach((comment) => {
                    Comment.findByIdAndRemove(ObjectID(comment), (err, result) => {
                    });
                });

            });
        });

        // delete items
        Item.deleteMany({ category: foundCat.name }, (err, foundItems) => {
        });
    });

    // delete category
    Category.findByIdAndRemove(req.params.id, (err, result) => {
        if (!err) {
            res.redirect("/category/new");
        }
    });

});

module.exports = router;