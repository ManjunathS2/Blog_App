import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

const Login = () => {
  const { setIsAuthenticated, setProfile } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "https://blog-app-2iif.onrender.com/api/users/login",
        { email, password, role },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        },
      );
      localStorage.setItem("jwt", data.token);
      setIsAuthenticated(true);
      setProfile(data.user);
      toast.success(data.message || "Logged in successfully!");
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Welcome Back
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Role</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition duration-200"
          >
            Login
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 font-semibold hover:underline"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
