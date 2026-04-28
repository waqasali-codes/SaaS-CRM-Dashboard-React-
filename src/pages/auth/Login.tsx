import { useEffect, useState } from "react";
import { signIn } from "../../services/authService";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { Mail, Lock } from "lucide-react";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await signIn(email, password);

    if (error) {
      toast.error(error.message);
      setError(error.message);
      setLoading(false);
      return;
    }

    toast.success("Login successful");
    navigate("/dashboard");
  };

  const fillSuperAdminDemo = () => {
    setEmail("waqasalimughal760@gmail.com");
    setPassword("12345678");
    setError("");
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8">

        {/* HEADER */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Welcome Back
          </h1>
          <p className="text-gray-500 dark:text-gray-300 text-sm">
            Login to your CRM dashboard
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">

          <div>
            <label className="text-sm text-gray-600 dark:text-gray-300">
              Email
            </label>

            <div className="relative mt-1">
              <Mail size={18} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600 dark:text-gray-300">
              Password
            </label>

            <div className="relative mt-1">
              <Lock size={18} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="password"
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading && (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            )}
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        {/* DEMO ACCESS - Super Admin  */}
        <div className="mt-5 rounded-xl border border-blue-100 dark:border-blue-900/40 bg-blue-50/70 dark:bg-blue-950/20 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-gray-800 dark:text-white">
                Super Admin Demo
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Instantly test the full CRM with complete platform access.
              </p>
            </div>

            <button
              type="button"
              onClick={fillSuperAdminDemo}
              className="shrink-0 rounded-lg border border-blue-200 dark:border-blue-800 px-3 py-1.5 text-xs font-medium text-blue-700 dark:text-blue-300 hover:bg-white dark:hover:bg-blue-900/30 transition"
            >
              Fill Demo
            </button>
          </div>
        </div>

        {/* FOOTER */}
        <p className="text-center text-sm text-gray-500 dark:text-gray-300 mt-6">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-600 font-medium hover:underline"
          >
            Sign up
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;