const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const handleData = require("./handleData");

const app = express();

app.use(bodyParser({ extended: false }));
app.use(cors());

app.post("/csv", (req, res) => {
  handleData(req.body.list, "csv");
});

app.post("/json", (req, res) => {
  handleData(req.body.list, "json");
});

app.listen(3001, () => console.log("Server has be runed!"));
