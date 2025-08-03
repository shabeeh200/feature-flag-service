// require('dotenv').config();

// const Flag = require('../model/Flagmodel');
// const FlagLog= require('../model/log.model');
// const cache = require('../middleware/cache');

// // Normalize trailing slashes (important for consistent cache keys)
// const normalizeKey = (key) => key.replace(/\/+$/, '') || '/';

// const allFlagsKey = normalizeKey('/api/flags');
// const ttlSeconds = parseInt(process.env.CACHE_TTL, 10) || 60;

// // Helper to invalidate cache
// const invalidate = (path) => {
//   const normalized = normalizeKey(path);
//   cache.del(normalized);
//   console.log(`[CACHE INVALIDATE] ${normalized}`);
// };

// // CREATE
// const createFlag = async (req, res) => {
//   const { name, description = '', enabled = false, tags = [], environment = 'dev', rolloutPercentage = 100, targetUsers = [] } = req.body;

//   if (!name || typeof name !== 'string' || name.includes(' ')) {
//     return res.status(400).json({ message: 'Flag name is required and must not contain spaces.' });
//   }

//   const flagData = {
//     name: name.trim(),
//     description: description.trim(),
//     enabled,
//     tags: Array.isArray(tags) ? tags.map(tag => tag.trim()).filter(Boolean) : [],
//     environment,
//     rolloutPercentage,
//     targetUsers
//   };

//   try {
//     const flag = await Flag.create(flagData);

//     // ✅ Log creation
//     await FlagLog.create({
//       flagId: flag._id,
//       action: 'create',
//       user: 'System',
//       before: null,
//       after: flag
//     });

//     invalidate(allFlagsKey);
//     const allFlags = await Flag.find();
//     cache.set(allFlagsKey, allFlags, ttlSeconds);
//     cache.set(`${allFlagsKey}/${flag._id}`, flag, ttlSeconds);

//     return res.status(201).json(flag);
//   } catch (err) {
//     return res.status(500).json({ message: 'Server error during flag creation.', error: err.message });
//   }
// };

// // const createFlag = async (req, res) => {
// //   const { name, description = '', enabled = false, tags = [] } = req.body;

// //   if (!name || typeof name !== 'string' || name.includes(' ')) {
// //     return res.status(400).json({ message: 'Flag name is required and must not contain spaces.' });
// //   }

// //   const flagData = {
// //     name: name.trim(),
// //     description: description.trim(),
// //     enabled,
// //     tags: Array.isArray(tags) ? tags.map(tag => tag.trim()).filter(Boolean) : [],
// //   };

// //   try {
// //     const flag = await Flag.create(flagData);

// //     invalidate(allFlagsKey);

// //     const allFlags = await Flag.find();
// //     cache.set(allFlagsKey, allFlags, ttlSeconds);
// //     cache.set(`${allFlagsKey}/${flag._id}`, flag, ttlSeconds);

// //     return res.status(201).json(flag);
// //   } catch (err) {
// //     return res.status(500).json({ message: 'Server error during flag creation.', error: err.message });
// //   }
// // };

// // GET ALL
// const getAllFlags = async (req, res) => {
//   try {
//     const flags = await Flag.find();

//     if (!flags || flags.length === 0) {
//       return res.status(200).json({ message: 'No flags found.', flags: [] });
//     }

//     cache.set(allFlagsKey, flags, ttlSeconds);
//     flags.forEach(f => cache.set(`${allFlagsKey}/${f._id}`, f, ttlSeconds));

//     return res.status(200).json(flags);
//   } catch (err) {
//     return res.status(500).json({ message: 'Error fetching flags.', error: err.message });
//   }
// };

// // GET ONE
// const getFlagById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const flag = await Flag.findById(id);
//     if (!flag) {
//       return res.status(404).json({ message: 'Flag not found' });
//     }
//     return res.status(200).json(flag);
//   } catch (err) {
//     return res.status(500).json({ message: err.message });
//   }
// };

// // UPDATE
// const updateFlagById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const oldFlag = await Flag.findById(id);
//     if (!oldFlag) {
//       return res.status(404).json({ message: 'Flag not found' });
//     }

//     const updated = await Flag.findByIdAndUpdate(id, req.body, { new: true });

//     // ✅ Log update
//     await FlagLog.create({
//       flagId: updated._id,
//       action: 'update',
//       user: 'System',
//       before: oldFlag,
//       after: updated
//     });

//     invalidate(allFlagsKey);
//     invalidate(`${allFlagsKey}/${id}`);

//     return res.status(200).json(updated);
//   } catch (err) {
//     return res.status(500).json({ message: err.message });
//   }
// };

// // const updateFlagById = async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     const updated = await Flag.findByIdAndUpdate(id, req.body, { new: true });
// //     if (!updated) {
// //       return res.status(404).json({ message: 'Flag not found' });
// //     }

// //     invalidate(allFlagsKey);
// //     invalidate(`${allFlagsKey}/${id}`);

// //     return res.status(200).json(updated);
// //   } catch (err) {
// //     return res.status(500).json({ message: err.message });
// //   }
// // };

// // TOGGLE
// const toggleFlagById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const flag = await Flag.findById(id);
//     if (!flag) {
//       return res.status(404).json({ message: 'Flag not found' });
//     }

//     const old = { ...flag.toObject() };

//     flag.enabled = !flag.enabled;
//     await flag.save();

//     // ✅ Log toggle
//     await FlagLog.create({
//       flagId: flag._id,
//       action: 'toggle',
//       user: 'System',
//       before: old,
//       after: flag
//     });

//     invalidate(allFlagsKey);
//     invalidate(`${allFlagsKey}/${id}`);

//     return res.status(200).json(flag);
//   } catch (err) {
//     return res.status(500).json({ message: err.message });
//   }
// };

// // const toggleFlagById = async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     const flag = await Flag.findById(id);
// //     if (!flag) {
// //       return res.status(404).json({ message: 'Flag not found' });
// //     }

// //     flag.enabled = !flag.enabled;
// //     await flag.save();

// //     invalidate(allFlagsKey);
// //     invalidate(`${allFlagsKey}/${id}`);

// //     return res.status(200).json(flag);
// //   } catch (err) {
// //     return res.status(500).json({ message: err.message });
// //   }
// // };

// // DELETE
// const deleteFlagById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const removed = await Flag.findByIdAndDelete(id);
//     if (!removed) {
//       return res.status(404).json({ message: 'Flag not found' });
//     }

//     // ✅ Log delete
//     await FlagLog.create({
//       flagId: removed._id,
//       action: 'delete',
//       user: 'System',
//       before: removed,
//       after: null
//     });

//     invalidate(allFlagsKey);
//     invalidate(`${allFlagsKey}/${id}`);

//     return res.status(204).send();
//   } catch (err) {
//     return res.status(500).json({ message: err.message });
//   }
// };

// // const deleteFlagById = async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     const removed = await Flag.findByIdAndDelete(id);
// //     if (!removed) {
// //       return res.status(404).json({ message: 'Flag not found' });
// //     }

// //     invalidate(allFlagsKey);
// //     invalidate(`${allFlagsKey}/${id}`);

// //     return res.status(204).send();
// //   } catch (err) {
// //     return res.status(500).json({ message: err.message });
// //   }
// // };

// // Simple hashing function for rollout decision
// const getFlagLog=async(req, res)=>{
// try {
//     const logs = await FlagLog.find().sort({ timestamp: -1 });
//     res.status(200).json(logs);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
// const hashUserToPercentage = (userId, flagId) => {
//   const hash = require('crypto')
//     .createHash('sha256')
//     .update(userId + flagId)
//     .digest('hex');
//   const intValue = parseInt(hash.slice(0, 8), 16); // Use part of hash
//   return intValue % 100; // 0 to 99
// };

// const evaluateFlagForUser = async (req, res) => {
//   const { userId, flagId } = req.params;

//   try {
//     const flag = await Flag.findById(flagId);
//     if (!flag) return res.status(404).json({ message: 'Flag not found' });

//     const inTargetUsers = flag.targetUsers?.includes(userId);
//     const isInRollout = hashUserToPercentage(userId, flag._id) < (flag.rolloutPercentage || 0);

//     const enabledForUser = flag.enabled && (inTargetUsers || isInRollout);

//     return res.status(200).json({
//       userId,
//       flagId,
//       enabledForUser,
//       reason: {
//         globallyEnabled: flag.enabled,
//         inTargetUsers,
//         withinRollout: isInRollout,
//       },
//     });
//   } catch (err) {
//     return res.status(500).json({ message: err.message });
//   }
// };

// module.exports = {
//   createFlag,
//   getAllFlags,
//   getFlagById,
//   updateFlagById,
//   toggleFlagById,
//   deleteFlagById,
//   evaluateFlagForUser,
//   getFlagLog,
// };

require('dotenv').config();
const crypto = require('crypto');
const Flag = require('../models/Flagmodel');
const FlagLog = require('../models/log.model');
const diffObjects = require('../utils/diffObjects');
const mockUsers=require("../models/userFakemodel");
const { invalidate, normalizeKey } = require("../middleware/cache");
const allFlagsKey = normalizeKey("/api/flags");
// Create a new flag
const createFlag = async (req, res) => {
  try {
    const flag = await Flag.create(req.body);

    await FlagLog.create({
      flagId: flag._id,
      action: 'create',
      user: 'System',
      before: null,
      after: flag.toObject(),
      changes: diffObjects({}, flag.toObject())
    });
    invalidate(allFlagsKey);
    invalidate(`${allFlagsKey}/${flag._id}`);
    res.status(201).json(flag);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all flags
// const getAllFlags = async (req, res) => {
//   try {
//     const flags = await Flag.find();
//     res.status(200).json(flags);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
const getAllFlags = async (req, res) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
    const skip  = (page - 1) * limit;

    // 1) add sort so newest appear first  
    // 2) add .lean() for faster plain-JS results  
    const [ flags, total ] = await Promise.all([
      Flag.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Flag.countDocuments()
    ]);

    return res.status(200).json({
      flags,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};


const getUsers = (req, res) => {
  try {
    res.status(200).json(mockUsers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Get single flag by ID
const getFlagById = async (req, res) => {
  try {
    const flag = await Flag.findById(req.params.id);
    if (!flag) return res.status(404).json({ message: 'Flag not found' });
    res.status(200).json(flag);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Update flag by ID
const updateFlagById = async (req, res) => {
  try {
    const oldFlag = await Flag.findById(req.params.id);
    if (!oldFlag) return res.status(404).json({ message: 'Flag not found' });

    const updated = await Flag.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });

    await FlagLog.create({
      flagId: updated._id,
      action: 'update',
      user: 'System',
      before: oldFlag.toObject(),
      after: updated.toObject(),
      changes: diffObjects(oldFlag.toObject(), updated.toObject())
    });
    invalidate(allFlagsKey);
    invalidate(`${allFlagsKey}/${req.params.id}`);
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Toggle flag status
const toggleFlagById = async (req, res) => {
  try {
    const flag = await Flag.findById(req.params.id);
    if (!flag) return res.status(404).json({ message: 'Flag not found' });

    const old = flag.toObject();
    flag.enabled = !flag.enabled;
    await flag.save();

    await FlagLog.create({
      flagId: flag._id,
      action: 'toggle',
      user: 'System',
      before: old,
      after: flag.toObject(),
      changes: diffObjects(old, flag.toObject())
    });
    invalidate(allFlagsKey);
    invalidate(`${allFlagsKey}/${req.params.id}`);
    res.status(200).json(flag);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete flag by ID
const deleteFlagById = async (req, res) => {
  try {
    const removed = await Flag.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ message: 'Flag not found' });

    await FlagLog.create({
      flagId: removed._id,
      action: 'delete',
      user: 'System',
      before: removed.toObject(),
      after: null,
      changes: diffObjects(removed.toObject(), {})
    });
    invalidate(allFlagsKey);
    invalidate(`${allFlagsKey}/${req.params.id}`);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get flag logs (full or changes-only)
const getFlagLog = async (req, res) => {
  try {
    const full = req.query.full === 'true';
    const logs = await FlagLog.find().sort({ timestamp: -1 });

    if (full) {
      return res.status(200).json(logs);
    }

    const leanLogs = logs.map(log => ({
      _id: log._id,
      flagId: log.flagId,
      action: log.action,
      user: log.user,
      timestamp: log.timestamp,
      changes: log.changes
    }));

    return res.status(200).json(leanLogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Helper function
const hashUserToPercentage = (userId, flagId) => {
  const hash = crypto
    .createHash('sha256')
    .update(userId + flagId)
    .digest('hex');
  const intValue = parseInt(hash.slice(0, 8), 16); // 32-bit int from hash
  return intValue % 100; // Range: 0–99
};

const evaluateFlagForUser = async (req, res) => {
  const { flagId, userId } = req.params;

  try {
    const flag = await Flag.findById(flagId);
    if (!flag) return res.status(404).json({ message: 'Flag not found' });

    const inTargetUsers = flag.targetUsers?.includes(userId);
    const isInRollout = hashUserToPercentage(userId, flag._id.toString()) < (flag.rolloutPercentage || 0);

    const enabledForUser = flag.enabled && (inTargetUsers || isInRollout);

    return res.status(200).json({
      userId,
      flagId,
      enabledForUser,
      reason: {
        globallyEnabled: flag.enabled,
        inTargetUsers,
        withinRollout: isInRollout,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createFlag,
  getAllFlags,
  getFlagById,
  updateFlagById,
  toggleFlagById,
  deleteFlagById,
  getFlagLog,
  evaluateFlagForUser,
  getUsers
};

