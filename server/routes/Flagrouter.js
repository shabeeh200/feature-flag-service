// const express = require("express");
// const router = express.Router();
// const { createFlag,
//   getAllFlags,
//   getFlagByKey,
//   updateFlag,
//   toggleFlag,
//   deleteFlag}=require("../controller/Flagcontroller");
// const apiKeyAuth=require("../middlewear/apiKeyAuth");

// router.post("/",apiKeyAuth ,createFlag);
// router.get("/",apiKeyAuth ,getAllFlags);
// router.get("")

// module.exports=router;
// routes/flags.js

const express = require('express');
const router  = express.Router();

const apiKeyAuth      = require("../middleware/apiKeyAuth");
const cacheMiddleware = require('../middleware/cacheMiddleware');
const {
  createFlag,
  getAllFlags,
  getFlagByKey,
  updateFlag,
  toggleFlag,
  deleteFlag,
} =require("../controller/Flagcontroller");

// READS (cached)

// READS (cached)
router.get('/',        cacheMiddleware, getAllFlags);
router.get('/:name',   cacheMiddleware, getFlagByKey);

// WRITES (invalidate happens inside controllers)
router.post('/',       apiKeyAuth,      createFlag);
router.put('/:name',   apiKeyAuth,      updateFlag);
router.patch('/:name/toggle', apiKeyAuth, toggleFlag);
router.delete('/:name', apiKeyAuth,     deleteFlag);

module.exports = router;
