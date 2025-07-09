require('dotenv').config();

const Flag = require('../model/Flagmodel');
const cache = require('../middleware/cache');

// Normalize trailing slashes (important for consistent cache keys)
const normalizeKey = (key) => key.replace(/\/+$/, '') || '/';

const allFlagsKey = normalizeKey('/api/flags');
const ttlSeconds = parseInt(process.env.CACHE_TTL, 10) || 60;

// Helper to invalidate cache
const invalidate = (path) => {
  const normalized = normalizeKey(path);
  cache.del(normalized);
  console.log(`[CACHE INVALIDATE] ${normalized}`);
};

// CREATE
const createFlag = async (req, res) => {
  const { name, description = '', enabled = false, tags = [] } = req.body;

  if (!name || typeof name !== 'string' || name.includes(' ')) {
    return res.status(400).json({ message: 'Flag name is required and must not contain spaces.' });
  }

  const flagData = {
    name: name.trim(),
    description: description.trim(),
    enabled,
    tags: Array.isArray(tags) ? tags.map(tag => tag.trim()).filter(Boolean) : [],
  };

  try {
    const flag = await Flag.create(flagData);

    invalidate(allFlagsKey);

    const allFlags = await Flag.find();
    cache.set(allFlagsKey, allFlags, ttlSeconds);
    cache.set(`${allFlagsKey}/${flag._id}`, flag, ttlSeconds);

    return res.status(201).json(flag);
  } catch (err) {
    return res.status(500).json({ message: 'Server error during flag creation.', error: err.message });
  }
};

// GET ALL
const getAllFlags = async (req, res) => {
  try {
    const flags = await Flag.find();

    if (!flags || flags.length === 0) {
      return res.status(200).json({ message: 'No flags found.', flags: [] });
    }

    cache.set(allFlagsKey, flags, ttlSeconds);
    flags.forEach(f => cache.set(`${allFlagsKey}/${f._id}`, f, ttlSeconds));

    return res.status(200).json(flags);
  } catch (err) {
    return res.status(500).json({ message: 'Error fetching flags.', error: err.message });
  }
};

// GET ONE
const getFlagById = async (req, res) => {
  try {
    const { id } = req.params;
    const flag = await Flag.findById(id);
    if (!flag) {
      return res.status(404).json({ message: 'Flag not found' });
    }
    return res.status(200).json(flag);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// UPDATE
const updateFlagById = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Flag.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ message: 'Flag not found' });
    }

    invalidate(allFlagsKey);
    invalidate(`${allFlagsKey}/${id}`);

    return res.status(200).json(updated);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// TOGGLE
const toggleFlagById = async (req, res) => {
  try {
    const { id } = req.params;
    const flag = await Flag.findById(id);
    if (!flag) {
      return res.status(404).json({ message: 'Flag not found' });
    }

    flag.enabled = !flag.enabled;
    await flag.save();

    invalidate(allFlagsKey);
    invalidate(`${allFlagsKey}/${id}`);

    return res.status(200).json(flag);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// DELETE
const deleteFlagById = async (req, res) => {
  try {
    const { id } = req.params;
    const removed = await Flag.findByIdAndDelete(id);
    if (!removed) {
      return res.status(404).json({ message: 'Flag not found' });
    }

    invalidate(allFlagsKey);
    invalidate(`${allFlagsKey}/${id}`);

    return res.status(204).send();
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
};

