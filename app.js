if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: ".env" });
}

const express = require("express");
const app = express();

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname));

app.listen(process.env.PORT || PORT);
