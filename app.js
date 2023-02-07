const express = require("express");
const app = express();
const port = 3001;

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname));

app.listen(port, () => {});
