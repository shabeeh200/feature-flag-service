require('dotenv').config();
const crypto = require('crypto');
const Flag = require('../models/Flagmodel');
const FlagLog = require('../models/log.model');
const diffObjects = require('../utils/diffObjects');
const mockUsers=require("../models/userFakemodel");
const { invalidate } = require("../middleware/cache");
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
    await invalidate("/api/flags");
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
   await invalidate("/api/flags");
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
    await invalidate("/api/flags");
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
    await invalidate("/api/flags");
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
const getStats = async (req, res) => {
  try {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7*24*60*60*1000);

    // 1. Total / Enabled counts
    const [ totalFlags, enabledCount ] = await Promise.all([
      Flag.countDocuments(),
      Flag.countDocuments({ enabled: true }),
    ]);
    const disabledCount = totalFlags - enabledCount;

    // 2. Flags by environment
    const byEnvAgg = await Flag.aggregate([
      { $group: { _id: "$environment", count: { $sum: 1 } } }
    ]);
    const byEnv = { dev: 0, staging: 0, prod: 0 };
    byEnvAgg.forEach(e => { byEnv[e._id] = e.count; });

    // 3. Rollout buckets (0–25, 26–50, 51–75, 76–100)
    const bucketAgg = await Flag.aggregate([
      {
        $bucket: {
          groupBy: "$rolloutPercentage",
          boundaries: [0, 26, 51, 76, 101],
          default: "Other",
          output: { count: { $sum: 1 } }
        }
      }
    ]);
    // Map the aggregation _id to human-readable ranges
    const labelMap = { 0: "0–25", 26: "26–50", 51: "51–75", 76: "76–100" };
    const rolloutBuckets = bucketAgg
      .filter(b => b._id !== "Other")
      .map(b => ({
        range: labelMap[b._id],
        count: b.count
      }));

    // 4. New flags created in last 7 days
    const newThisWeek = await Flag.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    // 5. Evaluation calls in last 7 days
    const evalsThisWeek = await FlagLog.countDocuments({
      timestamp: { $gte: sevenDaysAgo }
    });

    return res.json({
      totalFlags,
      enabledCount,
      disabledCount,
      byEnv,
      rolloutBuckets,
      newThisWeek,
      evalsThisWeek
    });
  } catch (err) {
    console.error("getStats error:", err);
    return res.status(500).json({ message: "Server error" });
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
  getUsers,
  getStats
};

