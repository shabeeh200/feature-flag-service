// models/FlagLog.js
const mongoose = require('mongoose');

const FlagLogSchema = new mongoose.Schema({
  flagId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Flag' },
  action:   { type: String, enum: ['create','update','toggle','delete'], required: true },
  user:     { type: String, default: 'System' },

  // Full snapshots
  before:   { type: Object, default: null },
  after:    { type: Object, default: null },

  // Pre‑computed diff of what actually changed
  changes:  { type: Object, default: {} },

  timestamp:{ type: Date, default: Date.now }
});

module.exports = mongoose.model('FlagLog', FlagLogSchema);
