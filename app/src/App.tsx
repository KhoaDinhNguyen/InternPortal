import { Route, Routes } from "react-router";
import "./App.css";
import DashboardPage from "./pages/Dashboard";
import LoginPage from "./pages/Login";
import ProtectedRoute from "@components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<DashboardPage />} />
      </Route>
    </Routes>
  );
}

export default App;
