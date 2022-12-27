const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  amount: {
    type: Number,
    require: true,
    default: 0,
  },

  date: {
    type: Date,
    require: true,
    default: new Date(),
  },

  categories: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: "Category",
  },
  user_id: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("Transactions", TransactionSchema);
