const express = require("express");
const app = express();
const path = require('path');

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => {
  res.render( "index");
});

app.get("/scripts.js", (req, res) => {
  res.sendFile(__dirname + "/src/scripts.js");
})

app.get("/board.js", (req, res) => {
  res.sendFile(__dirname + "/src/board.js");
})

app.get("/utilities.js", (req, res) => {
  res.sendFile(__dirname + "/src/utilities.js");
})

app.get("/number.js", (req, res) => {
  res.sendFile(__dirname + "/src/number.js");
})

app.get("/celebration.js", (req, res) => {
  res.sendFile(__dirname + "/src/celebration.js");
})
app.get("/index.css", (req, res) => {
  res.sendFile(__dirname + "/index");
})

app.listen(process.env.PORT || PORT, (err) => {
  if (err) {
    console.log(err)
  } else {
    console.log(`Server is listening on port ${PORT}`);
  }
});
