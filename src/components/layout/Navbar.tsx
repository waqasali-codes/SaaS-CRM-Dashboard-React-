import { useAuth } from "../../context/authContext";
import { signOut } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { Menu, Sun, Moon, LogOut } from "lucide-react";
import { useTheme } from "../../context/themeContext";

type Props = {
  toggleSidebar?: () => void;
};

const Navbar = ({ toggleSidebar }: Props) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <div className="flex justify-between items-center px-4 md:px-6 py-3 bg-white dark:bg-gray-800 border-b dark:border-gray-700 shadow-sm">

      {/* LEFT */}
      <div className="flex items-center gap-3">

        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-white"
        >
          <Menu size={22} />
        </button>

        <div>
          <h1 className="font-bold text-lg text-gray-800 dark:text-white">
            CRM Dashboard
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
            SaaS Management Panel
          </p>
        </div>

      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3 md:gap-4">

        {/* THEME TOGGLE */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg border dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition text-gray-700 dark:text-white"
        >
          {theme === "dark" ? (
            <Sun size={18} />
          ) : (
            <Moon size={18} />
          )}
        </button>

        {/* USER */}
        <div className="hidden md:block text-right">
          <p className="text-sm text-gray-700 dark:text-gray-200">
            {user?.email}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {user?.role || "user"}
          </p>
        </div>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm transition"
        >
          <LogOut size={16} />
          <span className="hidden sm:block">Logout</span>
        </button>

      </div>

    </div>
  );
};

export default Navbar;