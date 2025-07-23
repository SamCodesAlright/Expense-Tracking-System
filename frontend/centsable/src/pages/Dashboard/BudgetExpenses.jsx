import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useParams } from "react-router-dom";
import { useUserAuth } from "../../hooks/useUserAuth";
import Modal from "../../components/Modal";
import toast from "react-hot-toast";
import DeleteAlert from "../../components/layouts/DeleteAlert";
import BudgetsExpenseList from "../../components/BudgetExpenses/BudgetsExpenseList";
import BudgetsExpenseOverview from "../../components/BudgetExpenses/BudgetsExpenseOverview";

function BudgetExpenses() {
  useUserAuth();
  const { budgetId } = useParams();
  const [budgetExpenses, setBudgetExpenses] = useState([]);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });

  const fetchBudgetExpenseDetails = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.EXPENSE.GET_BUDGET_EXPENSES(budgetId)
      );

      const expenses = response.data.expenses || [];
      const budget = response.data.budget || null;

      setBudgetExpenses(expenses);

      // Fallback: If budget is not explicitly returned, infer it from expenses
      if (!budget && expenses.length > 0) {
        const inferredBudget = {
          title: expenses[0].category, // or use expenses[0].budgetTitle if available
          id: budgetId,
        };
        setSelectedBudget(inferredBudget);
      } else {
        setSelectedBudget(budget);
      }
    } catch (error) {
      console.error("Failed to fetch budget expense details", error);
    }
  };

  const deleteExpense = async (expenseId) => {
    try {
      await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(expenseId));
      toast.success("Expense Deleted Successfully");
      fetchBudgetExpenseDetails();
      setOpenDeleteAlert({ show: false, data: null });
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast.error("Failed to delete expense");
    }
  };

  useEffect(() => {
    fetchBudgetExpenseDetails();
  }, [budgetId]);

  console.log("selectedBudget:", selectedBudget);

  return (
    <DashboardLayout activeMenu="Budget">
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 gap-6">
          {selectedBudget && (
            <div>
              <BudgetsExpenseOverview transactions={budgetExpenses} />
            </div>
          )}
          <BudgetsExpenseList
            transactions={budgetExpenses}
            onDelete={(id) => setOpenDeleteAlert({ show: true, data: id })}
          />
        </div>

        {/* Delete Expense Modal */}
        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title="Delete Expense"
        >
          <DeleteAlert
            content="Are you sure you want to delete this expense?"
            onDelete={() => deleteExpense(openDeleteAlert.data)}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
}

export default BudgetExpenses;
