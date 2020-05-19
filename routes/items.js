const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();

const Item = require("../models/items");
const { checkAdminAuthorization } = require("../middleware/auth");

// Show all items
router.get("/items", (req, res) => {
    Item.find({}, (err, foundItems) => {
        if (err) {
            return res.redirect("/items");
        }

        res.render("itemViews/itemsShowPage", { foundItems });

    });
});


// Show add new Item form 
router.get("/items/new", checkAdminAuthorization, (req, res) => {
    res.render("itemViews/addItem");
});

const Storage = multer.diskStorage({
    destination: "./public/uploads",
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    }

});

const upload = multer({
    storage: Storage
}).single("file");

// Add new item to database 
router.post("/items", upload, checkAdminAuthorization, async (req, res) => {
    const item = new Item({
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        image: req.file.filename
    });

    await item.save();
    res.redirect("/items");

});

// Show an item details
router.get("/items/:id", (req, res) => {
    Item.findById(req.params.id).populate("comments").exec((err, foundItem) => {
        if (err) {
            return res.redirect("/items");
        }

        if (foundItem) {
            res.render("itemViews/showItemDetails", { foundItem });
        } else {
            res.send("Item not found!"); //SHOW 404.........
        }
    })
});


module.exports = router;