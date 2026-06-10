import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";

function LoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.email.trim() ||
      !formData.password
    ) {
      return alert(
        "Email and password are required"
      );
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !emailRegex.test(
        formData.email.trim()
      )
    ) {
      return alert(
        "Enter a valid email"
      );
    }

    try {
      const data = await loginUser(formData);

      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "userId",
        data.userId
      );

      navigate("/dashboard");
    } catch (error) {
      alert(
        error.response?.data?.message || "Login Failed"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-white flex items-center justify-center px-6">

      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-rose-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-fuchsia-200/30 rounded-full blur-3xl" />
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="bg-white/90 backdrop-blur-md rounded-[32px] shadow-xl border border-rose-100 p-8"
        >
          <div className="mb-8 text-center">

            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r from-rose-600 to-fuchsia-700 flex items-center justify-center text-white text-2xl font-bold shadow-lg mb-4">
              C
            </div>

            <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-700 via-pink-700 to-fuchsia-700 bg-clip-text text-transparent">
              Welcome Back
            </h1>

            <p className="text-slate-500 mt-2">
              Sign in to continue to your accountability groups
            </p>
          </div>

          <div className="space-y-4">

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email
              </label>

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                onChange={handleChange}
                className="w-full px-4 py-3 border border-rose-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>

              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                onChange={handleChange}
                className="w-full px-4 py-3 border border-rose-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-fuchsia-700 text-white font-semibold hover:shadow-lg hover:scale-[1.01] transition-all duration-300"
            >
              Login
            </button>
            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-slate-200"></div>

              <span className="px-4 text-sm text-slate-400">
                OR
              </span>

              <div className="flex-1 border-t border-slate-200"></div>
            </div>

            <p className="text-center text-sm text-slate-500">
              New here?{" "}
              <span
                onClick={() => navigate("/register")}
                className="font-semibold text-rose-700 cursor-pointer hover:text-fuchsia-700 transition"
              >
                Create an account
              </span>
            </p>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500">
              Stay consistent. Stay accountable.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;