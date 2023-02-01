const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: [true, "Please add a username"],
      unique: true,
    },
    email: {
      type: String,
      require: [true, "Please add a email"],
      unique: true,
    },
    password: {
      type: String,
      require: true,
    },
    budget: {
      type: Number,
      default: 0,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
