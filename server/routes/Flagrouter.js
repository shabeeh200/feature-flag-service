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
  getFlagById,
  updateFlagById,
  toggleFlagById,
  deleteFlagById,
} =require("../controller/Flagcontroller");

// READS (cached)

// READS (cached)
router.get('/',        cacheMiddleware, getAllFlags);
router.get('/:id',   cacheMiddleware, getFlagById);

// WRITES (invalidate happens inside controllers)
router.post('/',       apiKeyAuth,      createFlag);
router.put('/:id',   apiKeyAuth,      updateFlagById);
router.patch('/:id/toggle', apiKeyAuth, toggleFlagById);
router.delete('/:id', apiKeyAuth,     deleteFlagById);

module.exports = router;
