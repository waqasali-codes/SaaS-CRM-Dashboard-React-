import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../services/supabase";
import { useAuth } from "../../context/authContext";
import toast from "react-hot-toast";
import {
  Shield,
  User,
  Users,
  Crown,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

type UserProfile = {
  id: string;
  email: string;
  role: "admin" | "user";
};

const SUPER_ADMIN_ID = "2cfcb343-dbd5-4a67-bcbc-8e701cabad46";

const UserManagement = () => {
  const { user: currentUser } = useAuth();

  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const isSuperAdmin = currentUser?.id === SUPER_ADMIN_ID;

  const fetchUsers = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("profiles")
      .select("id, email, role")
      .order("email", { ascending: true });

    if (error) {
      toast.error("Failed to load users");
      console.error(error);
      setLoading(false);
      return;
    }

    setUsers((data as UserProfile[]) || []);
    setLoading(false);
  };

  const updateRole = async (id: string, newRole: "admin" | "user") => {
    setUpdatingId(id);

    const { error } = await supabase
      .from("profiles")
      .update({ role: newRole })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update role");
      setUpdatingId(null);
      return;
    }

    toast.success(`Role updated to ${newRole}`);
    await fetchUsers();
    setUpdatingId(null);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const currentProfile = useMemo(
    () => users.find((u) => u.id === currentUser?.id),
    [users, currentUser]
  );

  const visibleUsers = useMemo(
    () => users.filter((u) => u.id !== SUPER_ADMIN_ID),
    [users]
  );

  const admins = visibleUsers.filter((u) => u.role === "admin");
  const normalUsers = visibleUsers.filter((u) => u.role === "user");

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const renderTable = (
    title: string,
    description: string,
    rows: UserProfile[],
    type: "admin" | "user"
  ) => (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/40 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="font-semibold text-lg">{title}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700">
              <th className="px-4 py-3 text-left font-semibold">Email</th>
              <th className="px-4 py-3 text-left font-semibold">Role</th>
              <th className="px-4 py-3 text-right font-semibold">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60">
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="px-4 py-10 text-center text-gray-500 dark:text-gray-400"
                >
                  No {type === "admin" ? "admins" : "users"} found
                </td>
              </tr>
            ) : (
              rows.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition"
                >
                  <td className="px-4 py-3">{item.email}</td>

                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
                        item.role === "admin"
                          ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                          : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {item.role === "admin" ? (
                        <Shield size={14} />
                      ) : (
                        <User size={14} />
                      )}
                      {item.role}
                    </span>
                  </td>

                 <td className="px-4 py-3 text-right">
  {item.id === currentUser?.id ? (
    <span className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 cursor-not-allowed">
      Your Account
    </span>
  ) : (
    <button
      onClick={() =>
        updateRole(item.id, item.role === "admin" ? "user" : "admin")
      }
      disabled={updatingId === item.id}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${
        item.role === "admin"
          ? "bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
          : "bg-blue-600 hover:bg-blue-700 text-white"
      } disabled:opacity-60 disabled:cursor-not-allowed`}
    >
      {updatingId === item.id ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : item.role === "admin" ? (
        <ArrowDownRight size={15} />
      ) : (
        <ArrowUpRight size={15} />
      )}

      Make {item.role === "admin" ? "User" : "Admin"}
    </button>
  )}
</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="w-full text-gray-900 dark:text-white space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
          <Users size={20} className="text-blue-600 dark:text-blue-400" />
        </div>

        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage users and roles
          </p>
        </div>
      </div>

      {/* Super Admin Card */}
      {isSuperAdmin && currentProfile && (
        <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
              <Crown size={20} className="text-amber-600 dark:text-amber-400" />
            </div>

            <div>
              <h2 className="font-semibold text-lg">Super Admin</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {currentProfile.email}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Admins */}
      {renderTable(
        "Admins",
        isSuperAdmin
          ? "All admins except Super Admin"
          : "All administrator accounts",
        admins,
        "admin"
      )}

      {/* Users */}
      {renderTable(
        "Users",
        "All standard user accounts",
        normalUsers,
        "user"
      )}
    </div>
  );
};

export default UserManagement;