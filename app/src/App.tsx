import { Route, Routes } from "react-router";
import "./App.css";
import DashboardPage from "./pages/Dashboard";
import LoginPage from "./pages/Login";
import ProtectedRoute from "@components/ProtectedRoute";
import AuthProvider from "./features/login/AuthProvider";
import AdminPage from "./features/admin/AdminPage";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<DashboardPage />} />
        </Route>

        <Route element={<ProtectedRoute allow={["admin"]} />}>
          <Route path="/admin" element={<AdminPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
