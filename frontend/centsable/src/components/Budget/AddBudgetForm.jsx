import React, { useState } from "react";
import Input from "../Inputs/Input";
import EmojiPickerPopup from "../EmojiPickerPopup";

const AddBudgetForm = ({ onAddBudget }) => {
  const [budget, setBudget] = useState({
    name: "",
    icon: "",
    amount: "",
    category: "",
    period: "monthly",
  });

  const handleChange = (key, value) => setBudget({ ...budget, [key]: value });

  return (
    <div>
      <EmojiPickerPopup
        icon={budget.icon}
        onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
      />
      <Input
        label="Budget Category"
        value={budget.category}
        onChange={({ target }) => handleChange("category", target.value)}
        placeholder="Shopping, Travel, etc."
        type="text"
      />
      <Input
        label="Amount"
        value={budget.amount}
        onChange={({ target }) => handleChange("amount", target.value)}
        placeholder=""
        type="number"
      />
      <div className="mt-2">
        <label className="text-[13px] text-slate-800">Budget Period</label>
        <div className="input-box">
          <select
            value={budget.period}
            onChange={(e) => handleChange("period", e.target.value)}
            className="w-full bg-transparent outline-none"
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="annually">Annually</option>
          </select>
        </div>
      </div>
      <Input
        label="Date"
        value={budget.date}
        onChange={({ target }) => handleChange("date", target.value)}
        placeholder=""
        type="date"
      />
      <div className="flex justify-end mt-6">
        <button
          type="button"
          className="add-btn add-btn-fill"
          onClick={() => onAddBudget(budget)}
        >
          Add Budget
        </button>
      </div>
    </div>
  );
};

export default AddBudgetForm;
