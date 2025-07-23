import React, { useState, useEffect } from "react";
import Input from "../Inputs/Input";
import EmojiPickerPopup from "../EmojiPickerPopup";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";

const AddExpenseForm = ({ budgetId, onClose }) => {
  const [expense, setExpense] = useState({
    category: "",
    amount: "",
    date: "",
    icon: "",
    title: "",
  });

  const [budgetCategories, setBudgetCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (key, value) => {
    setExpense((prev) => ({ ...prev, [key]: value }));
  };

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get("/api/v1/budget/get"); // adjust if your route is different
        const uniqueCategories = [
          ...new Set(res.data.map((budget) => budget.category)),
        ];
        setBudgetCategories(uniqueCategories);
      } catch (error) {
        console.error("Failed to load categories:", error);
        toast.error("Unable to fetch budget categories");
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async () => {
    const { category, amount, date, icon, title } = expense;

    if (!title || !category || !amount || !date) {
      return toast.error("All fields are required");
    }

    setLoading(true);

    try {
      await axiosInstance.post(`/api/v1/expense/add/${budgetId}`, {
        title,
        category,
        amount: parseFloat(amount),
        date,
        icon,
      });

      toast.success("Expense added successfully");
      onClose();
    } catch (error) {
      console.error("Error adding expense:", error);
      toast.error("Failed to add expense");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <EmojiPickerPopup
        icon={expense.icon}
        onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
      />
      <Input
        value={expense.title}
        onChange={({ target }) => handleChange("title", target.value)}
        label="Expense Title"
        placeholder="e.g., Petrol, Movie ticket"
        type="text"
      />

      {/* Category Dropdown */}

      <div className="mt-2">
        <label className="text-[13px] text-slate-800">Category</label>
        <div className="input-box">
          <select
            value={expense.category}
            onChange={(e) => handleChange("category", e.target.value)}
            className="w-full bg-transparent outline-none"
          >
            <option value="">-- Select Category --</option>
            {budgetCategories.map((cat, idx) => (
              <option key={idx} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Input
        value={expense.amount}
        onChange={({ target }) => handleChange("amount", target.value)}
        label="Amount (₹)"
        type="number"
      />
      <Input
        value={expense.date}
        onChange={({ target }) => handleChange("date", target.value)}
        label="Date"
        type="date"
      />

      <div className="flex justify-end mt-6">
        <button
          type="button"
          className="add-btn add-btn-fill"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Expense"}
        </button>
      </div>
    </div>
  );
};

export default AddExpenseForm;
