import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../pages/dashboard/Dashboard";
import LeadsList from "../pages/leads/LeadsList";
import MainLayout from "../components/layout/MainLayout";
import UserManagement from "../pages/management/UserManagement";
const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />

          {/* PAGES */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="leads" element={<LeadsList />} />
          <Route path="users" element={<UserManagement />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" />} />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;