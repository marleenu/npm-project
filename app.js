const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(express.static("src"));

app.set("view engine", "ejs");

app.get("/src/scripts.js", (req, res) => {
  res.sendFile(__dirname + "scripts.js");
})

app.get("/", (req, res) => {
  res.render("index");
});



app.listen(process.env.PORT || PORT, (err) => {
  if (err) {
    console.log(err)
  } else {
    console.log(`Server is listening on port ${PORT}`);
  }
});
