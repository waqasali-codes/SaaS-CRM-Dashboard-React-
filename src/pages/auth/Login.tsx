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

        {/* FORM */}
        <form onSubmit={handleLogin} className="space-y-4">

          {/* EMAIL */}
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

          {/* PASSWORD */}
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

          {/* ERROR */}
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          {/* BUTTON */}
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