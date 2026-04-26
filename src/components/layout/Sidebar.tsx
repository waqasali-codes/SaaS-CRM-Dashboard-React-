import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, Cloud } from "lucide-react";

type Props = {
  closeSidebar?: () => void;
};

const Sidebar = ({ closeSidebar }: Props) => {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `relative flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition
    ${
      isActive
        ? "bg-blue-600 text-white shadow"
        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
    }`;

  return (
    <div className="w-64 h-full flex flex-col bg-white dark:bg-gray-900 border-r dark:border-gray-700">

      {/* LOGO */}
      <div className="p-5 border-b dark:border-gray-700 flex items-center gap-3">
        <Cloud className="text-blue-600 dark:text-blue-400" size={22} />

        <div>
          <h2 className="text-xl font-bold">CRM Panel</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            SaaS Dashboard
          </p>
        </div>
      </div>

      {/* NAV */}
      <nav className="flex flex-col gap-1 p-3">

        <NavLink to="/dashboard" onClick={closeSidebar} className={linkClass}>
          <LayoutDashboard size={18} />
          Dashboard
        </NavLink>

        <NavLink to="/leads" onClick={closeSidebar} className={linkClass}>
          <Users size={18} />
          Leads
        </NavLink>

      </nav>

      {/* FOOTER */}
      <div className="mt-auto p-4 text-xs text-gray-400 border-t dark:border-gray-700">
        CRM v1.0 • Waqas Panel
      </div>
    </div>
  );
};

export default Sidebar;