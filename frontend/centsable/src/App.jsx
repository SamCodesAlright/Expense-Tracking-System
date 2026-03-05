import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { waitForBackend } from "./utils/waitForBackend";
import BackendLoader from "./components/BackendLoader";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import Home from "./pages/Dashboard/Home";
import Income from "./pages/Dashboard/Income";
import Expense from "./pages/Dashboard/Expense";
import Budget from "./pages/Dashboard/Budget";
import UserProvider from "./context/userContext";
import { Toaster } from "react-hot-toast";
import BudgetExpenses from "./pages/Dashboard/BudgetExpenses";

const App = () => {
  const [backendReady, setBackendReady] = useState(false);

  useEffect(() => {
    const checkBackend = async () => {
      const ready = await waitForBackend();
      setBackendReady(ready);
    };

    checkBackend();
  }, []);

  if (!backendReady) {
    return <BackendLoader />;
  }

  return (
    <UserProvider>
      <div>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" exact element={<Login />} />
            <Route path="/signup" exact element={<SignUp />} />
            <Route path="/dashboard" exact element={<Home />} />
            <Route path="/income" exact element={<Income />} />
            <Route path="/expense" exact element={<Expense />} />
            <Route path="/budget" exact element={<Budget />} />
            <Route
              path="/budget/:budgetId/expense"
              element={<BudgetExpenses />}
            />
          </Routes>
        </Router>
      </div>

      <Toaster toastOptions={{ className: "", style: { fontSize: "13px" } }} />
    </UserProvider>
  );
};

export default App;
