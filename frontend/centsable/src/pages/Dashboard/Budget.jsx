import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useUserAuth } from "../../hooks/useUserAuth";
import toast from "react-hot-toast";
import Modal from "../../components/Modal";
import AddBudgetForm from "../../components/Budget/AddBudgetForm";
import BudgetOverview from "../../components/Budget/BudgetOverview";
import BudgetList from "../../components/Budget/BudgetList";
import DeleteAlert from "../../components/layouts/DeleteAlert";
import AddExpenseForm from "../../components/Expense/AddExpenseForm";

function Budget() {
  useUserAuth();

  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(false);

  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });

  const [openAddBudgetModal, setOpenAddBudgetModal] = useState(false);
  const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);

  // Open expense modal for a specific budget
  const handleAddExpenseClick = (budget) => {
    setSelectedBudget(budget);
    setOpenAddExpenseModal(true);
  };

  // Fetch all budgets from the backend
  const fetchBudgetDetails = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const res = await axiosInstance.get(
        API_PATHS.BUDGET.GET_ALL_BUDGET_ITEMS
      );
      if (res.data) {
        setBudgets(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch budget data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle budget creation
  const handleAddBudget = async (budget) => {
    const { icon, category, amount, date, period } = budget;

    if (!category.trim()) return toast.error("Category is required!");
    if (!amount || isNaN(amount) || Number(amount) <= 0)
      return toast.error("Amount must be greater than 0");
    if (!date) return toast.error("Date is required!");
    if (!period) return toast.error("Period is required!");

    try {
      await axiosInstance.post(API_PATHS.BUDGET.ADD_BUDGET, {
        icon,
        category,
        amount,
        date,
        period,
      });

      setOpenAddBudgetModal(false);
      toast.success("Budget added successfully");
      fetchBudgetDetails();
    } catch (error) {
      console.error("Error adding budget:", error);
      toast.error("Failed to add budget");
    }
  };

  // Handle budget deletion
  const handleDeleteBudget = async (id) => {
    try {
      await axiosInstance.delete(API_PATHS.BUDGET.DELETE_BUDGET(id));
      setOpenDeleteAlert({ show: false, data: null });
      toast.success("Budget deleted successfully");
      fetchBudgetDetails();
    } catch (error) {
      console.error("Error deleting budget:", error);
      toast.error("Failed to delete budget");
    }
  };

  // Handle download
  const handleDownloadBudgetDetails = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.BUDGET.DOWNLOAD_BUDGET,
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "budget_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download budget details");
    }
  };

  useEffect(() => {
    fetchBudgetDetails();
  }, []);

  return (
    <DashboardLayout activeMenu="Budget">
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 gap-6">
          <BudgetOverview
            budgets={budgets}
            onAddBudget={() => setOpenAddBudgetModal(true)}
          />

          <BudgetList
            budgets={budgets}
            onDelete={(id) => setOpenDeleteAlert({ show: true, data: id })}
            onAddExpense={handleAddExpenseClick}
            onDownload={handleDownloadBudgetDetails}
          />
        </div>

        {/* Modal: Add Expense */}
        <Modal
          isOpen={openAddExpenseModal}
          onClose={() => setOpenAddExpenseModal(false)}
          title={`Add Expense to ${selectedBudget?.category || ""}`}
        >
          <AddExpenseForm
            budgetId={selectedBudget?._id}
            onClose={() => {
              setOpenAddExpenseModal(false);
              fetchBudgetDetails();
            }}
          />
        </Modal>

        {/* Modal: Add Budget */}
        <Modal
          isOpen={openAddBudgetModal}
          onClose={() => setOpenAddBudgetModal(false)}
          title="Add Budget"
        >
          <AddBudgetForm onAddBudget={handleAddBudget} />
        </Modal>

        {/* Modal: Delete Budget */}
        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title="Delete Budget"
        >
          <DeleteAlert
            content="Are you sure you want to delete this budget?"
            onDelete={() => handleDeleteBudget(openDeleteAlert.data)}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
}

export default Budget;
