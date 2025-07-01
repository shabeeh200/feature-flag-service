// const Flag= require("../model/Flagmodel");

// const createFlag= async (req,res)=>
// {
// try{
// const flag = await Flag.create(req.body);
// res.status(200).json(flag);
// }
// catch (error){
// res.status(500).json({ message: error.message });
// }
// };

// const getFlag = async (req , res)=>{

//   try {
//     const flags = await Flag.find();
//     if (flags.length === 0) {
//       return res.status(404).json({ success: false, message: 'No orders found.' });
//     }
//     res.status(200).json({ success: true, flags });
//   } catch (err) {
//     res.status(500).json({ success: false, message: 'Failed to retrieve orders.', error: err.message });
//   }
// };

//  module.exports = {
// createFlag,
//  getFlag
//  };
// server/controllers/flagsController.js
// controllers/flagsController.js

// controllers/flagsController.js
// controllers/flagsController.js
// controllers/flagsController.js
require('dotenv').config();

const Flag  = require('../model/Flagmodel');
const cache = require('../middleware/cache');

const allFlagsKey = '/api/flags';
const ttlSeconds  = parseInt(process.env.CACHE_TTL, 10) || 60;

// Helper to invalidate a cache key
const invalidate = (path) => {
  cache.del(path);
  console.log(`[CACHE INVALIDATE] ${path}`);
};

const createFlag = async (req, res) => {
  try {
    const flag = await Flag.create(req.body);

    // 1) Invalidate old caches
    invalidate(allFlagsKey);
    invalidate(`${allFlagsKey}/${flag.name}`);

    // 2) Prime new caches
    const allFlags = await Flag.find();
    cache.set(allFlagsKey, allFlags, ttlSeconds);
    console.log(`[CACHE PRIME] ${allFlagsKey}`);
    cache.set(`${allFlagsKey}/${flag.name}`, flag, ttlSeconds);
    console.log(`[CACHE PRIME] ${allFlagsKey}/${flag.name}`);

    return res.status(201).json(flag);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getAllFlags = async (req, res) => {
  try {
    const flags = await Flag.find();

    // 1) Cache the full list
    cache.set(allFlagsKey, flags, ttlSeconds);
    console.log(`[CACHE SET] ${allFlagsKey}`);

    // 2) Prime each individual flag
    flags.forEach(flag => {
      const key = `${allFlagsKey}/${flag.name}`;
      cache.set(key, flag, ttlSeconds);
      console.log(`[CACHE PRIME] ${key}`);
    });

    return res.status(200).json(flags);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getFlagByKey = async (req, res) => {
  try {
    const { name } = req.params;
    const flag = await Flag.findOne({ name });
    if (!flag) {
      return res.status(404).json({ message: 'Flag not found' });
    }
    return res.status(200).json(flag);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const updateFlag = async (req, res) => {
  try {
    const { name } = req.params;
    const updated = await Flag.findOneAndUpdate({ name }, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ message: 'Flag not found' });
    }

    // Invalidate caches
    invalidate(allFlagsKey);
    invalidate(`${allFlagsKey}/${name}`);

    return res.status(200).json(updated);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const toggleFlag = async (req, res) => {
  try {
    const { name } = req.params;
    const flag = await Flag.findOne({ name });
    if (!flag) {
      return res.status(404).json({ message: 'Flag not found' });
    }

    flag.enabled = !flag.enabled;
    await flag.save();

    // Invalidate caches
    invalidate(allFlagsKey);
    invalidate(`${allFlagsKey}/${name}`);

    return res.status(200).json(flag);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const deleteFlag = async (req, res) => {
  try {
    const { name } = req.params;
    const removed = await Flag.findOneAndDelete({ name });
    if (!removed) {
      return res.status(404).json({ message: 'Flag not found' });
    }

    // Invalidate caches
    invalidate(allFlagsKey);
    invalidate(`${allFlagsKey}/${name}`);

    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createFlag,
  getAllFlags,
  getFlagByKey,
  updateFlag,
  toggleFlag,
  deleteFlag,
};

// require('dotenv').config();

// const Flag  = require('../models/Flag');
// const cache = require('../middleware/cache');

// const allFlagsKey = '/api/flags';
// const ttlSeconds  = parseInt(process.env.CACHE_TTL, 10) || 60;

// // Helper to invalidate a cache key
// const invalidate = (path) => {
//   cache.del(path);
//   console.log(`[CACHE INVALIDATE] ${path}`);
// };

// const createFlag = async (req, res) => {
//   try {
//     const flag = await Flag.create(req.body);

//     // 1) Invalidate old caches
//     invalidate(allFlagsKey);
//     invalidate(`${allFlagsKey}/${flag.name}`);

//     // 2) Prime new caches
//     const allFlags = await Flag.find();
//     cache.set(allFlagsKey, allFlags, ttlSeconds);
//     console.log(`[CACHE PRIME] ${allFlagsKey}`);
//     cache.set(`${allFlagsKey}/${flag.name}`, flag, ttlSeconds);
//     console.log(`[CACHE PRIME] ${allFlagsKey}/${flag.name}`);

//     return res.status(201).json(flag);
//   } catch (err) {
//     return res.status(500).json({ message: err.message });
//   }
// };

// const getAllFlags = async (req, res) => {
//   try {
//     const flags = await Flag.find();

//     // 1) Cache the full list
//     cache.set(allFlagsKey, flags, ttlSeconds);
//     console.log(`[CACHE SET] ${allFlagsKey}`);

//     // 2) Prime each individual flag
//     flags.forEach(flag => {
//       const key = `${allFlagsKey}/${flag.name}`;
//       cache.set(key, flag, ttlSeconds);
//       console.log(`[CACHE PRIME] ${key}`);
//     });

//     return res.status(200).json(flags);
//   } catch (err) {
//     return res.status(500).json({ message: err.message });
//   }
// };

// const getFlagByKey = async (req, res) => {
//   try {
//     const { name } = req.params;
//     const flag = await Flag.findOne({ name });
//     if (!flag) {
//       return res.status(404).json({ message: 'Flag not found' });
//     }
//     return res.status(200).json(flag);
//   } catch (err) {
//     return res.status(500).json({ message: err.message });
//   }
// };

// const updateFlag = async (req, res) => {
//   try {
//     const { name } = req.params;
//     const updated = await Flag.findOneAndUpdate({ name }, req.body, { new: true });
//     if (!updated) {
//       return res.status(404).json({ message: 'Flag not found' });
//     }

//     // Invalidate caches
//     invalidate(allFlagsKey);
//     invalidate(`${allFlagsKey}/${name}`);

//     return res.status(200).json(updated);
//   } catch (err) {
//     return res.status(500).json({ message: err.message });
//   }
// };

// const toggleFlag = async (req, res) => {
//   try {
//     const { name } = req.params;
//     const flag = await Flag.findOne({ name });
//     if (!flag) {
//       return res.status(404).json({ message: 'Flag not found' });
//     }

//     flag.enabled = !flag.enabled;
//     await flag.save();

//     // Invalidate caches
//     invalidate(allFlagsKey);
//     invalidate(`${allFlagsKey}/${name}`);

//     return res.status(200).json(flag);
//   } catch (err) {
//     return res.status(500).json({ message: err.message });
//   }
// };

// const deleteFlag = async (req, res) => {
//   try {
//     const { name } = req.params;
//     const removed = await Flag.findOneAndDelete({ name });
//     if (!removed) {
//       return res.status(404).json({ message: 'Flag not found' });
//     }

//     // Invalidate caches
//     invalidate(allFlagsKey);
//     invalidate(`${allFlagsKey}/${name}`);

//     return res.status(204).send();
//   } catch (err) {
//     return res.status(500).json({ message: err.message });
//   }
// };

// module.exports = {
//   createFlag,
//   getAllFlags,
//   getFlagByKey,
//   updateFlag,
//   toggleFlag,
//   deleteFlag,
// };


// const Flag = require('../models/Flag');
// const cache = require("../middleware/cache");
// // Create a new flag
// const createFlag = async (req, res) => {
//   try {
//     const flag = await Flag.create(req.body);
//     res.status(201).json(flag);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Get all flags
// const getAllFlags = async (req, res) => {
//   try {
//     const flags = await Flag.find();
//     res.status(200).json(flags);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Get a single flag by its key
// const getFlagByKey = async (req, res) => {
//   try {
//     const { key } = req.params;
//     const flag = await Flag.findOne({ key });
//     if (!flag) return res.status(404).json({ message: 'Flag not found' });
//     res.status(200).json(flag);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Get a single flag by its MongoDB _id
// const getFlagById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const flag = await Flag.findById(id);
//     if (!flag) return res.status(404).json({ message: 'Flag not found' });
//     res.status(200).json(flag);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Update (full edit) a flag by key
// const updateFlag = async (req, res) => {
//   try {
//     const { key } = req.params;
//     const updates = req.body;
//     const flag = await Flag.findOneAndUpdate({ key }, updates, { new: true });
//     if (!flag) return res.status(404).json({ message: 'Flag not found' });
//     res.status(200).json(flag);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Toggle only the enabled field by key
// const toggleFlag = async (req, res) => {
//   try {
//     const { key } = req.params;
//     const flag = await Flag.findOne({ key });
//     if (!flag) return res.status(404).json({ message: 'Flag not found' });
//     flag.enabled = !flag.enabled;
//     await flag.save();
//     res.status(200).json(flag);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Delete a flag by key
// const deleteFlag = async (req, res) => {
//   try {
//     const { key } = req.params;
//     const result = await Flag.findOneAndDelete({ key });
//     if (!result) return res.status(404).json({ message: 'Flag not found' });
//     res.status(204).send();
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// module.exports = {
//   createFlag,
//   getAllFlags,
//   getFlagByKey,
//   getFlagById,
//   updateFlag,
//   toggleFlag,
//   deleteFlag,
// };
