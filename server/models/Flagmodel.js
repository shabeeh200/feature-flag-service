const mongoose = require("mongoose");

const FlagSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your flag name"],
      unique: true,
    },
    description: {
      type: String,
      required: false,

    },
    tags: {
      type:[String],
      required: true,
    },
    enabled: {
      type: Boolean,
      required: true,
    },environment: {
    type: String,
    enum: ['dev', 'staging', 'prod'],
    default: 'dev'
  },

  targetUsers: [{ type: String }], // list of user IDs
  rolloutPercentage: {
    type: Number,
    min: 0,
    max: 100,
    default: 100
  },
}, { timestamps: true });

const Flag = mongoose.model("Flag", FlagSchema);

module.exports = Flag;