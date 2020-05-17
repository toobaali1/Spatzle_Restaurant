// MONGOOSE MODEL TO ADD ITEMS
const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
    name: {
        type: String
    },
    price: {
        type: Number
    },
    description: {
        type: String
    }
});

const Item = new mongoose.model("Item", itemSchema);

module.exports = Item;