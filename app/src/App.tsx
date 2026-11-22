import { Route, Routes } from "react-router";
import DashboardPage from "./pages/Dashboard";
import HoursPage from "./pages/Hours";
import LoginPage from "./pages/Login";
import MessagesPage from "./pages/Messages";
import OrganizationPage from "./pages/Organization";
import TicketsPage from "./pages/Tickets";
import InternConfigPage from "./pages/InternConfig";
import ProtectedRoute from "@components/ProtectedRoute";
import PortalLayout from "./layouts/PortalLayout";
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
          {/* Pages with the sidebar */}
          <Route element={<PortalLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/hours" element={<HoursPage />} />
            <Route path="/organization" element={<OrganizationPage />} />
            <Route path="/tickets" element={<TicketsPage />} />

            {/* Admin-only pages that keep the sidebar */}
            <Route element={<ProtectedRoute allow={["admin"]} />}>
              <Route path="/intern-config" element={<InternConfigPage />} />
            </Route>
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allow={["admin"]} />}>
          <Route element={<PortalLayout />}>
            <Route path="/admin" element={<AdminPage />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
