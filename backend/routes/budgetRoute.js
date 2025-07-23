const express = require("express");
const {
  addBudget,
  getAllBudgetItems,
  updateBudget,
  deleteBudget,
  downloadBudgetExcel,
  trackBudget,
  addExpenseToBudget,
} = require("../controllers/budgetController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/add", protect, addBudget);
router.get("/get", protect, getAllBudgetItems);
router.get("/downloadexcel", protect, downloadBudgetExcel);
router.put("/:id", protect, updateBudget);
router.delete("/:id", protect, deleteBudget);
router.get("/track", protect, trackBudget);
router.post("/add-expense/:budgetId", protect, addExpenseToBudget);

module.exports = router;
