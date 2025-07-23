import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import Modal from "../../components/Modal";
import toast from "react-hot-toast";
import DeleteAlert from "../../components/layouts/DeleteAlert";
import { useUserAuth } from "../../hooks/useUserAuth";
import ExpenseOverview from "../../components/Expense/ExpenseOverview";
import AddExpenseForm from "../../components/Expense/AddExpenseForm";
import ExpenseList from "../../components/Expense/ExpenseList";

function Expense() {
  useUserAuth();
  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });
  const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);

  // Fetch all expenses
  const fetchExpenseDetails = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await axiosInstance.get(
        API_PATHS.EXPENSE.GET_ALL_EXPENSE
      );
      if (response.data) {
        setExpenseData(response.data);
      }
    } catch (error) {
      console.error("Something went wrong. Please try again", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async (expense) => {
    const { title, category, amount, date, icon } = expense;

    if (!title.trim() || !category.trim() || !amount || !date) {
      toast.error("All fields are required");
      return;
    }

    try {
      await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, {
        title,
        category,
        amount: parseFloat(amount),
        date,
        icon,
      });

      toast.success("Expense Added Successfully.");
      setOpenAddExpenseModal(false);
      fetchExpenseDetails(); // refresh data
    } catch (error) {
      console.error("Error adding expense:", error);
      toast.error("Failed to add expense");
    }
  };

  // Delete Expense
  const deleteExpense = async (id) => {
    try {
      await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id));
      setOpenDeleteAlert({ show: false, data: null });
      toast.success("Expense Details Deleted Successfully!");
      fetchExpenseDetails();
    } catch (error) {
      console.error(
        "Error deleting the Expense: ",
        error.response?.data?.message || error.message
      );
    }
  };

  // Download Excel Sheet
  const handleDownloadExpenseDetails = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.EXPENSE.DOWNLOAD_EXPENSE,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "expense_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading expense details sheet:", error);
      toast.error("Failed to download expense details. Please try again");
    }
  };

  useEffect(() => {
    fetchExpenseDetails();
  }, []);

  return (
    <DashboardLayout activeMenu="Expense">
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <ExpenseOverview
              transactions={expenseData}
              onAddExpense={() => setOpenAddExpenseModal(true)}
            />
          </div>

          <ExpenseList
            transactions={expenseData}
            onDelete={(id) => {
              setOpenDeleteAlert({ show: true, data: id });
            }}
            onDownload={handleDownloadExpenseDetails}
          />
        </div>

        {/* Add Expense Modal */}
        <Modal
          isOpen={openAddExpenseModal}
          onClose={() => setOpenAddExpenseModal(false)}
          title="Add Expense"
        >
          <AddExpenseForm onAddExpense={handleAddExpense} />
        </Modal>

        {/* Delete Expense Modal */}
        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title="Delete Expense"
        >
          <DeleteAlert
            content="Are you sure you want to delete this expense detail?"
            onDelete={() => deleteExpense(openDeleteAlert.data)}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
}

export default Expense;
