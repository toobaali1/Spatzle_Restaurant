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
    },
    image: {
        type: String
    },
    category: {
        type: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

const Item = new mongoose.model("Item", itemSchema);

module.exports = Item;