// app.js
const express = require('express');
const cors = require("cors");

const routeFlag = require("./routes/Flagrouter");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/flags", routeFlag);

app.get("/", (req, res) => {
  res.send("Welcome to the Flags API");
});

module.exports = app;
