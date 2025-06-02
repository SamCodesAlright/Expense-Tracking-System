const xlsx = require("xlsx");
const Expense = require("../models/Expense");

// Add Expense Category
exports.addExpense = async (req, res) => {
  const userId = req.user.id;

  try {
    const { icon, category, amount, date } = req.body;

    // Validation: Checking for the missing fields
    if (!category || !amount || !date) {
      return res.status(400).json({ message: "All Fields are Required" });
    }

    const newExpense = new Expense({
      userId,
      icon,
      category,
      amount,
      date: new Date(date),
    });

    await newExpense.save();
    res.status(200).json(newExpense);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Get All expense Category
exports.getAllExpense = async (req, res) => {
  const userId = req.user.id;

  try {
    const expense = await Expense.find({ userId }).sort({ date: -1 });
    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete Income Source
exports.deleteExpense = async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: "Expense Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Download Expense Excel Sheet
exports.downloadExpenseExcel = async (req, res) => {
  const userId = req.user.id;

  try {
    const expense = await Expense.find({ userId }).sort({ date: -1 });

    // Preparing the data for Excel Sheet
    const data = expense.map((item) => ({
      Category: item.category,
      Amount: item.amount,
      Date: item.date,
    }));

    // Creates a new Excel workbook
    const wb = xlsx.utils.book_new();
    // Creates a new Excel worksheet
    const ws = xlsx.utils.json_to_sheet(data);
    // Adds the worksheet to the workbook
    xlsx.utils.book_append_sheet(wb, ws, "Expense");
    // Writes the workbook to a file
    xlsx.writeFile(wb, "expense_details.xlsx");
    // Sends the file to the client for download
    res.download("expense_details.xlsx");
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
