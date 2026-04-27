import { X, LayoutDashboard, Users, ShieldCheck, BarChart3 } from "lucide-react";

type Props = {
  onClose: () => void;
};

const WelcomeModal = ({ onClose }: Props) => {
  return (
    <div
      className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-2xl sm:rounded-3xl rounded-t-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-gray-700 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Welcome to CRM Dashboard
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Quick guide to help you understand the system
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body (scroll fix applied here) */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">

          <div className="rounded-2xl bg-blue-50 dark:bg-blue-900/20 p-4 border border-blue-100 dark:border-blue-800">
            <h3 className="font-semibold text-blue-700 dark:text-blue-300">
              What is this project?
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-2 leading-6">
              This CRM Dashboard helps teams manage leads, monitor business activity,
              and control user access in one place. It is built for managing clients,
              tracking lead progress, and organizing team workflow.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center gap-2 mb-3">
                <LayoutDashboard size={18} className="text-blue-600" />
                <h4 className="font-semibold">Dashboard</h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-6">
                View analytics, total leads, conversion stats, and quick business insights.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Users size={18} className="text-blue-600" />
                <h4 className="font-semibold">Leads</h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-6">
                Add, edit, filter, and manage all customer leads with status tracking.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck size={18} className="text-blue-600" />
                <h4 className="font-semibold">Roles</h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-6">
                Admins can manage users and assign roles. Standard users have limited access.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 size={18} className="text-blue-600" />
                <h4 className="font-semibold">Workflow</h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-6">
                Track lead movement from New → Contacted → Converted in one simple flow.
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-gray-50 dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold mb-2">Access Levels</h3>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2 leading-6">
              <li><strong>Super Admin:</strong> Full system access and role control.</li>
              <li><strong>Admin:</strong> Manage leads, users, and assign roles.</li>
              <li><strong>User:</strong> Manage only assigned leads.</li>
            </ul>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition"
          >
            Got it
          </button>
        </div>

      </div>
    </div>
  );
};

export default WelcomeModal;