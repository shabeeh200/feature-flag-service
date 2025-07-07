const express = require('express');
// const morgan = require('morgan');
const mongoose = require("mongoose");
require('dotenv').config();
const cors = require("cors");
//const { consoleLogger, fileLogger } = require('./middleware/logger');

const app = express();
const routeFlag=require("./routes/Flagrouter");
// 1. Logging middleware (logs method, URL, status, response time)
// app.use(morgan('dev'));
//app.use(consoleLogger);
// app.use(fileLogger);

// 2. JSON parser
app.use(cors());
app.use(express.json());

// Your routes…
app.use("/api/flags", routeFlag); 

// Optional: root or fallback route
app.get("/", (req, res) => {
  res.send("Welcome to the Flags API");
});

console.log("🔍 MONGODB_URL =", process.env.MONGODB_URL);
mongoose.connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Connected to database!");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Connection failed!", error);
  });

