const xlsx = require("xlsx");
const Expense = require("../models/Expense");
const Budget = require("../models/Budget");

exports.addExpense = async (req, res) => {
  try {
    const { title, icon, category, amount, date } = req.body;
    const userId = req.user.id;
    const { budgetId } = req.params;

    if (!title || !category || !amount || !date || !budgetId) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // 1. Create expense
    const expense = await Expense.create({
      title,
      icon,
      category,
      amount,
      date,
      userId,
      budgetId,
    });

    // 2. Link to budget (push expense ID)
    const budget = await Budget.findById(budgetId);
    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    budget.expenses.push(expense._id);
    budget.spent += parseFloat(amount); // 3. Update spent
    await budget.save();

    res
      .status(201)
      .json({ message: "Expense added and linked to budget", expense });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get All Expenses
exports.getAllExpense = async (req, res) => {
  const userId = req.user.id;

  try {
    const expenses = await Expense.find({ userId }).sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getExpensesByBudgetId = async (req, res) => {
  try {
    const { budgetId } = req.params;
    const userId = req.user.id;

    const expenses = await Expense.find({ userId, budgetId }).sort({
      date: -1,
    });

    res.status(200).json({ expenses });
  } catch (error) {
    console.error("Error fetching expenses for budget:", error);
    res.status(500).json({ message: "Failed to fetch expenses for budget" });
  }
};

// Delete Expense
exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    await expense.deleteOne();
    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Download Expense Excel Sheet
exports.downloadExpenseExcel = async (req, res) => {
  const userId = req.user.id;

  try {
    const expenses = await Expense.find({ userId }).sort({ date: -1 });

    const data = expenses.map((item) => ({
      Title: item.title,
      Category: item.category,
      Amount: item.amount,
      Date: item.date,
    }));

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, "Expenses");

    const filePath = "expense_details.xlsx";
    xlsx.writeFile(wb, filePath);

    res.download(filePath);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
