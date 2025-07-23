const Budget = require("../models/Budget");
const Expense = require("../models/Expense");
const xlsx = require("xlsx");
const moment = require("moment");

exports.addBudget = async (req, res) => {
  // Get User ID from the request object (assuming you have implemented authentication)
  const userId = req.user.id;

  try {
    // Extracting data from the request body to create a new budget
    const { icon, category, amount, period, date } = req.body;

    // Validation: Checking for the missing fields
    if (!category || !amount || !period || !date) {
      return res.status(400).json({ message: "All Fields are Required" });
    }

    // Creating a new budget item with the provided data
    const newBudget = new Budget({
      userId,
      icon,
      category,
      amount,
      period,
      date: new Date(date),
    });

    // Saving the new budget item to the database
    await newBudget.save();
    // Sending the newly created budget item as a response
    res.status(200).json(newBudget);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Get All Budget Items
exports.getAllBudgetItems = async (req, res) => {
  const userId = req.user.id;

  try {
    // Fetch budgets and populate expenses
    const budgetItems = await Budget.find({ userId })
      .populate("expenses")
      .sort({ date: -1 });

    // Map each budget to include calculated fields
    const formattedBudgets = budgetItems.map((budget) => {
      const startDate = moment(budget.date);
      let endDate = startDate.clone();

      // Calculate endDate based on period
      switch (budget.period) {
        case "weekly":
          endDate.add(7, "days");
          break;
        case "monthly":
          endDate.add(1, "month");
          break;
        case "annually":
        case "annual":
          endDate.add(1, "year");
          break;
        default:
          endDate = startDate.clone(); // fallback
      }

      // Calculate total spent from linked expenses (fallback to 0)
      const totalSpent = budget.expenses.reduce(
        (sum, exp) => sum + (exp.amount || 0),
        0
      );

      const amount = budget.amount || 0;
      const remaining = amount - totalSpent;
      const percentageUsed =
        amount > 0 ? ((totalSpent / amount) * 100).toFixed(2) : "0.00";

      return {
        _id: budget._id,
        icon: budget.icon || "",
        category: budget.category || "Uncategorized",
        amount,
        period: budget.period,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        spent: totalSpent,
        remaining,
        percentageUsed,
        expenseCount: budget.expenses.length,
      };
    });

    res.status(200).json(formattedBudgets);
  } catch (error) {
    console.error("Error in getAllBudgetItems:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.updateBudget = async (req, res) => {
  try {
    const { icon, category, amount, period, date } = req.body;
    const budgetId = req.params.id;

    // validating if all fields are provided or not
    if (!category || !amount || !period || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const updatedBudget = await Budget.findByIdAndUpdate(
      budgetId,
      { icon, category, amount, period, date: new Date(date) },
      { new: true }
    );

    res.json(updatedBudget);
  } catch (error) {
    console.error("Error in updateBudget:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.deleteBudget = async (req, res) => {
  try {
    await Budget.findByIdAndDelete(req.params.id);
    res.json({ message: "Budget Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.downloadBudgetExcel = async (req, res) => {
  const userId = req.user.id;

  try {
    const budgets = await Budget.find({ userId });
    const data = [];

    for (const budget of budgets) {
      const startDate = moment(budget.date);
      let endDate = startDate.clone();

      switch (budget.period) {
        case "weekly":
          endDate.add(7, "days");
          break;
        case "monthly":
          endDate.add(1, "month");
          break;
        case "annual":
          endDate.add(1, "year");
          break;
      }

      // Get expenses matching this budget's category and period
      const expenses = await Expense.find({
        userId,
        category: budget.category,
        date: { $gte: startDate.toDate(), $lte: endDate.toDate() },
      });

      const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);

      // Add the budget summary row
      data.push({
        Type: "BUDGET",
        Category: budget.category,
        Amount: budget.amount,
        Period: budget.period,
        "Start Date": startDate.format("YYYY-MM-DD"),
        "End Date": endDate.format("YYYY-MM-DD"),
        "Total Spent": totalSpent,
        Remaining: budget.amount - totalSpent,
      });

      // Add each expense as a sub-row
      expenses.forEach((exp) => {
        data.push({
          Type: "EXPENSE",
          Category: `→ ${exp.category}`,
          Amount: exp.amount,
          Date: moment(exp.date).format("YYYY-MM-DD"),
        });
      });

      data.push({}); // empty row for separation
    }

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, "Budget Report");

    const filePath = "budget_with_expenses.xlsx";
    xlsx.writeFile(wb, filePath);

    res.download(filePath);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.trackBudget = async (req, res) => {
  try {
    // Fetch all budgets for the user
    const budgets = await Budget.find({ user: req.user._id }).populate(
      "expenses"
    );

    const trackedData = budgets.map((budget) => {
      const startDate = moment(budget.startDate);
      let endDate = moment(budget.startDate);

      switch (budget.period) {
        case "weekly":
          endDate = endDate.add(7, "days");
          break;
        case "monthly":
          endDate = endDate.add(1, "month");
          break;
        case "annually":
          endDate = endDate.add(1, "year");
          break;
      }

      // Calculate remaining and percentageUsed dynamically
      const remaining = budget.amount - budget.spent;
      const percentageUsed =
        budget.amount > 0
          ? ((budget.spent / budget.amount) * 100).toFixed(2)
          : "0.00";

      return {
        _id: budget._id, // Unique budget ID
        category: budget.category, // Budget category
        icon: budget.icon, // Icon for UI
        amount: budget.amount, // Total budget amount
        period: budget.period, // "weekly", "monthly", "annually"
        startDate: startDate.format("YYYY-MM-DD"), // Properly formatted startDate
        endDate: endDate.format("YYYY-MM-DD"), // Dynamically calculated endDate
        currentSpending: budget.spent, // Already updated via expense logic
        remaining, // amount - spent (calculated in controller)
        percentageUsed, // (spent / amount) * 100 (formatted to 2 decimals)
        expenseCount: budget.expenses.length, // Count of expenses (assuming `populate("expenses")` used)
      };
    });

    res.status(200).json(trackedData);
  } catch (error) {
    console.error("Error in trackBudget:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.addExpenseToBudget = async (req, res) => {
  const { budgetId } = req.params;
  const { title, amount, date, category } = req.body;
  const userId = req.user.id;

  if (!title || !amount || !date || !category) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Create the expense
    const newExpense = new Expense({
      title,
      amount,
      date,
      category,
      userId,
    });
    const savedExpense = await newExpense.save();

    // Update the budget by adding this expense
    const updatedBudget = await Budget.findByIdAndUpdate(
      budgetId,
      {
        $push: { expenses: savedExpense._id },
        $inc: { spent: amount }, // Optional: update spent value
      },
      { new: true }
    ).populate("expenses");

    res.status(200).json(updatedBudget);
  } catch (err) {
    console.error("Error in adding expense to budget:", err);
    res.status(500).json({ message: "Server Error" });
  }
};
