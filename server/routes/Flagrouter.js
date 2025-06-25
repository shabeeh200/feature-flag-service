const express = require("express");
const router = express.Router();
const {createFlag}=require("../controller/Flagcontroller");
const apiKeyAuth=require("../middlewear/apiKeyAuth");

router.post("/",apiKeyAuth ,createFlag);

module.exports=router;