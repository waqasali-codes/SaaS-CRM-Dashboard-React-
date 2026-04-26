import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">

      {/* MOBILE OVERLAY */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`
          fixed z-50 inset-y-0 left-0 w-64
          bg-white dark:bg-gray-800
          border-r dark:border-gray-700
          transform transition-transform duration-300
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:block
        `}
      >
        <Sidebar closeSidebar={() => setIsSidebarOpen(false)} />
      </div>

      {/* MAIN AREA */}
      <div className="flex flex-col flex-1">

        <Navbar
          toggleSidebar={() => setIsSidebarOpen(prev => !prev)}
          isSidebarOpen={isSidebarOpen}
        />

        {/* CONTENT */}
        <div className="p-6 flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
          <Outlet />
        </div>

      </div>
    </div>
  );
};

export default MainLayout;