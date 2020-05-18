// MONGOOSE MODEL TO ADD COMMENTS
const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    text: {
        type: String
    },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: {
            type: String
        }
    }
});

const Comment = new mongoose.model("Comment", commentSchema);

module.exports = Comment;