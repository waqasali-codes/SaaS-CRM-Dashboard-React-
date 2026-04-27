// import { BrowserRouter, Routes, Route } from "react-router-dom";

// import Dashboard from "../pages/dashboard/Dashboard";
// import LeadsList from "../pages/leads/LeadsList";

// import MainLayout from "../components/layout/MainLayout";

// const AppRoutes = () => {
//   return (
//     <BrowserRouter>
//       <Routes>

//         {/* SAAS LAYOUT WRAPPER */}
//         <Route path="/" element={<MainLayout />}>
          
//           {/* CHILD ROUTES */}
//           <Route index element={<Dashboard />} />
//           <Route path="dashboard" element={<Dashboard />} />
//           <Route path="leads" element={<LeadsList />} />

//         </Route>

//       </Routes>
//     </BrowserRouter>
//   );
// };

// export default AppRoutes;


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

          {/* ✅ DEFAULT REDIRECT */}
          <Route index element={<Navigate to="dashboard" replace />} />

          {/* PAGES */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="leads" element={<LeadsList />} />
          <Route path="users" element={<UserManagement />} />
        </Route>

        {/* OPTIONAL FALLBACK */}
        <Route path="*" element={<Navigate to="/dashboard" />} />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;