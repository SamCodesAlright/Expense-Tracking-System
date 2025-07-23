const express = require("express");
const {
  addExpense,
  getAllExpense,
  deleteExpense,
  downloadExpenseExcel,
  getExpensesByBudgetId,
} = require("../controllers/expenseController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Add expense to a specific budget
router.post("/add/:budgetId", protect, addExpense);

// Get all expenses for the logged-in user
router.get("/get", protect, getAllExpense);

// Get expenses by budget ID
router.get("/budget/:budgetId", protect, getExpensesByBudgetId);

// Download all expenses in Excel format
router.get("/downloadexcel", protect, downloadExpenseExcel);

// Delete an expense by ID
router.delete("/:id", protect, deleteExpense);

module.exports = router;
