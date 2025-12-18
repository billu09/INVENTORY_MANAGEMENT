import React, { useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import { registerCompany } from "../../stores/slices/companySlice";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function CompanyRegister() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState(""); // email == username
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // ui state
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // ================= PASSWORD STRENGTH =================
  const strength = useMemo(() => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const percent = (score / 4) * 100;

    const levels = [
      { label: "Very Weak", color: "bg-red-600" },
      { label: "Weak", color: "bg-orange-500" },
      { label: "Fair", color: "bg-yellow-400" },
      { label: "Good", color: "bg-green-400" },
      { label: "Strong", color: "bg-green-600" },
    ];

    return { score, percent, ...levels[Math.min(score, 4)] };
  }, [password]);

  // ================= SUBMIT =================
  const submitCompany = async (e) => {
    e.preventDefault();

    // basic validation
    if (!name.trim() || !email.trim() || !password.trim()) {
      toast.error("All fields are required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (password.length < 8 || strength.score < 2) {
      toast.error("Please use a stronger password");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      await dispatch(
        registerCompany({
          name: name.trim(),
          username: email.trim(), // MUST match backend
          password,
        })
      ).unwrap();

      toast.success("Registration successful! Please log in.");
      navigate("/login", { replace: true });

    } catch (err) {
      const msg = typeof err === "string" ? err : "Registration failed";
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white">
      <div className="bg-gray-800/60 backdrop-blur-lg p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-700">

        <h1 className="text-3xl font-bold text-center mb-2">
          Inventory<span className="text-yellow-400">Pro</span>
        </h1>

        <h2 className="text-lg mb-6 font-semibold text-center">
          Company Registration
        </h2>

        {errorMsg && (
          <p className="mb-4 text-red-400 text-center">{errorMsg}</p>
        )}

        <form onSubmit={submitCompany} className="space-y-4">

          <div>
            <label className="block text-sm mb-1 text-gray-300">
              Company Name
            </label>
            <input
              className="w-full p-2 rounded text-black"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              placeholder="Acme Pvt Ltd"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-300">
              Email
            </label>
            <input
              type="email"
              className="w-full p-2 rounded text-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              placeholder="company@example.com"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-300">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full p-2 rounded text-black pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                autoComplete="new-password"
              />

              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600"
                tabIndex={-1}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
dir
            <div className="mt-2">
              <div className="w-full bg-gray-700 rounded h-2">
                <div
                  className={`${strength.color} h-2 rounded`}
                  style={{ width: `${strength.percent}%` }}
                />
              </div>

              <div className="flex justify-between text-xs mt-1">
                <span>{strength.label}</span>
                <span>{password.length} chars</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-yellow-400 text-gray-900 font-bold rounded hover:bg-yellow-300 disabled:opacity-60"
          >
            {loading ? "Registering..." : "Register Company"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-300">
          Already have an account?{" "}
          <Link to="/login" className="text-yellow-300 font-semibold">
            Sign in
          </Link>
        </div>

      </div>
    </div>
  );
}
