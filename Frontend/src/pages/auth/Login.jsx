// src/pages/auth/Login.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearAuthError } from "../../stores/slices/authSlice";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux auth state
  const { user, loading, error } = useSelector((state) => state.auth);

  // Local form state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // 🔔 Show backend / auth errors
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAuthError());
    }
  }, [error, dispatch]);

  // ✅ On successful login
  useEffect(() => {
    if (user) {
      toast.success("Login successful");
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      toast.error("Username and password are required");
      return;
    }

    dispatch(loginUser({ username, password }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700">
      <div className="w-[420px] bg-gray-800/60 backdrop-blur p-8 rounded-2xl border border-gray-700 shadow-xl text-white">

        <h1 className="text-2xl font-bold mb-6 text-center">
          Inventory<span className="text-yellow-400">Pro</span>
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1 text-gray-300">
              Email / Username
            </label>
            <input
              type="email"
              className="w-full p-2 rounded text-black"
              placeholder="you@example.com"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-300">
              Password
            </label>
            <input
              type="password"
              className="w-full p-2 rounded text-black"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-yellow-400 text-gray-900 font-bold rounded disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="mt-4 text-center text-xs text-gray-400">
          New company?{" "}
          <Link to="/companies/register" className="text-yellow-300">
            Register here
          </Link>
        </div>

      </div>
    </div>
  );
}
