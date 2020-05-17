const express = require("express");
const router = express.Router();

const Item = require("../models/items");

// Show all items
router.get("/items", (req, res) => {
    Item.find({}, (err, foundItems) => {
        if (err) {
            return res.redirect("/items");
        }

        res.render("itemViews/itemsShowPage", { foundItems });

    });
});

// Show add new Item form (?add auth for admin)
router.get("/items/new", (req, res) => {
    res.render("itemViews/addItem");
});

// Add new item to database (?add auth for admin)
router.post("/items", async (req, res) => {
    const item = new Item({
        name: req.body.name,
        price: req.body.price,
        description: req.body.description
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