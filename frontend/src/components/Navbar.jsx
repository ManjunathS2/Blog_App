import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import axios from "axios";
import toast from "react-hot-toast";

const Navbar = () => {
  const { isAuthenticated, setIsAuthenticated, setProfile, profile } =
    useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Mobile menu state

  const handleLogout = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:4001/api/users/logout",
        { withCredentials: true },
      );
      localStorage.removeItem("jwt");
      setIsAuthenticated(false);
      setProfile(null);
      toast.success(data.message || "Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-black text-blue-600 tracking-tighter"
          >
            Cilli<span className="text-gray-900">Blog</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {isAuthenticated ? (
              <>
                <Link
                  to="/"
                  className="text-gray-600 hover:text-blue-600 font-semibold transition"
                >
                  Home
                </Link>
                <Link
                  to="/creators"
                  className="text-gray-600 hover:text-blue-600 font-semibold transition"
                >
                  Creators
                </Link>

                {profile?.role === "admin" && (
                  <Link
                    to="/my-blogs"
                    className="text-gray-600 hover:text-blue-600 font-semibold transition"
                  >
                    My Dashboard
                  </Link>
                )}

                {profile?.role === "admin" && (
                  <Link
                    to="/create-blog"
                    className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold hover:bg-blue-700 transition shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    Write Article
                  </Link>
                )}

                <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
                  <img
                    src={profile?.photo}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover border border-gray-200"
                  />
                  <button
                    onClick={handleLogout}
                    className="text-gray-500 font-bold hover:text-red-500 transition"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="text-gray-600 font-bold hover:text-blue-600 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gray-900 text-white px-6 py-2 rounded-full font-bold hover:bg-black transition shadow-md"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg absolute w-full">
          <div className="px-4 pt-2 pb-6 space-y-2 flex flex-col">
            {isAuthenticated ? (
              <>
                {/* Mobile Profile Info */}
                <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-xl">
                  <img
                    src={profile?.photo}
                    alt="Profile"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-bold text-gray-900">{profile?.name}</p>
                    <p className="text-xs font-semibold text-blue-600 uppercase">
                      {profile?.role}
                    </p>
                  </div>
                </div>

                <Link
                  to="/"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-bold text-gray-700 hover:bg-gray-50"
                >
                  Home
                </Link>
                <Link
                  to="/creators"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-bold text-gray-700 hover:bg-gray-50"
                >
                  Creators
                </Link>

                {profile?.role === "admin" && (
                  <>
                    <Link
                      to="/my-blogs"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-3 py-2 rounded-md text-base font-bold text-gray-700 hover:bg-gray-50"
                    >
                      My Dashboard
                    </Link>
                    <Link
                      to="/create-blog"
                      onClick={() => setIsMenuOpen(false)}
                      className="block mt-2 text-center bg-blue-600 text-white px-3 py-3 rounded-xl font-bold shadow-md"
                    >
                      Write Article
                    </Link>
                  </>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left mt-2 px-3 py-2 text-base font-bold text-red-500 hover:bg-red-50 rounded-md"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-3 mt-4">
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full text-center bg-gray-100 text-gray-900 px-4 py-3 rounded-xl font-bold"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full text-center bg-gray-900 text-white px-4 py-3 rounded-xl font-bold"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
