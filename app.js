const express = require("express");
const bodyParser = require("body-parser");
require("./db/mongoose");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

const PORT = process.env.PORT || 3000;

// Landing Page
app.get("/", (req, res) => {
    res.render("home");
});

const itemsRoute = require("./routes/items");
app.use(itemsRoute);

const commentsRoute = require("./routes/comments");
app.use(commentsRoute);

app.listen(PORT, () => {
    console.log("Server is up on port", PORT);
});

