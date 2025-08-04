// app.js
const express = require('express');
const cors = require("cors");
const { apiLimiter } = require('./middleware/rateLimit');
const routeFlag = require("./routes/Flagrouter");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/flags",apiLimiter, routeFlag);

app.get("/", (req, res) => {
  res.send("Welcome to the Flags API");
});

module.exports = app;
