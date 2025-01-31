import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import AddEquipment from "./components/AddEquipment";
import DisplayHospitals from "./components/DisplayHospitals";
import LoginForm from "./components/LoginForm";
import AddUsers from "./components/AddUsers";
import HospitalDashboard from "./components/HospitalDashboard";
import ErrorPage from "./components/ErrorPage";
import RegisterHospital from "./components/RegisterHospital";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";

    if (loggedIn) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            !isLoggedIn ? (
              <LoginForm setIsLoggedIn={setIsLoggedIn} />
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            isLoggedIn ? (
              <HospitalDashboard setIsLoggedIn={setIsLoggedIn} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="dashboard/addequipment"
          element={isLoggedIn ? <AddEquipment /> : <Navigate to="/" />}
        />
        <Route path="/addusers" element={<AddUsers />} />
        <Route path="*" element={<ErrorPage />} />
        <Route path="/registerhospital" element={<RegisterHospital />} />
      </Routes>
    </Router>
  );
}

export default App;
