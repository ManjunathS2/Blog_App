import React from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./context/AuthProvider";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateBlog from "./pages/CreateBlog";
import SingleBlog from "./pages/SingleBlog";
import MyBlogs from "./pages/MyBlogs";
import UpdateBlog from "./pages/UpdateBlog";
import Creators from "./pages/Creators";

function App() {
  const location = useLocation();
  const token = localStorage.getItem("jwt");
  const hideNavbar = ["/login", "/register"].includes(location.pathname);

  return (
    <div>
      {!hideNavbar && <Navbar />}
      <Routes>
        {/* Core Routes */}
        <Route path="/" element={token ? <Home /> : <Navigate to="/login" />} />
        <Route
          path="/blog/:id"
          element={token ? <SingleBlog /> : <Navigate to="/login" />}
        />

        {/* Management Routes */}
        <Route
          path="/create-blog"
          element={token ? <CreateBlog /> : <Navigate to="/login" />}
        />
        <Route
          path="/my-blogs"
          element={token ? <MyBlogs /> : <Navigate to="/login" />}
        />
        <Route
          path="/update-blog/:id"
          element={token ? <UpdateBlog /> : <Navigate to="/login" />}
        />

        {/* Public Routes */}
        <Route path="/creators" element={<Creators />} />{" "}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
