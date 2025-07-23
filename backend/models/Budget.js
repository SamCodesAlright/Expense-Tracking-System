const mongoose = require("mongoose");

const BudgetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    icon: { type: String },
    category: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, trim: true },
    period: {
      type: String,
      enum: ["weekly", "monthly", "annually"],
      required: true,
    },
    date: { type: Date, default: Date.now },
    spent: { type: Number, default: 0 },
    expenses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Expense",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Budget", BudgetSchema);
