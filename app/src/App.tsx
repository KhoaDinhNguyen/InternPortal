import { Route, Routes } from "react-router";
import "./App.css";
import DashboardPage from "./pages/Dashboard";
import LoginPage from "./pages/Login";
import ProtectedRoute from "@components/ProtectedRoute";
import AuthProvider from "./features/login/AuthProvider";
import AdminPage from "./features/admin/AdminPage";
import ProfilePage from "./features/profile/ProfilePage";
import HistoryPage from "./features/requests/HistoryPage";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Route>

        <Route element={<ProtectedRoute allow={["admin"]} />}>
          <Route path="/admin" element={<AdminPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
