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
    },
  },
  {
    timestamps: true,
  }
);

const Flag = mongoose.model("Flag", FlagSchema);

module.exports = Flag;