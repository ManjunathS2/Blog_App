import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import toast from "react-hot-toast";

const SingleBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profile } = useAuth(); 

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSingleBlog = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:4001/api/blogs/single-blog/${id}`,
          { withCredentials: true },
        );
        setBlog(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchSingleBlog();
  }, [id]);

  // Function to handle deletion 
  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this article? This action cannot be undone.",
      )
    )
      return;

    try {
      const { data } = await axios.delete(
        `http://localhost:4001/api/blogs/delete/${id}`,
        { withCredentials: true },
      );
      toast.success(data.message || "Blog deleted successfully");
      navigate("/"); // Send them back to home after deleting
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to delete blog");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl font-bold text-gray-500 animate-pulse">
          Loading Article...
        </p>
      </div>
    );
  if (!blog)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl font-bold text-red-500">Blog not found.</p>
      </div>
    );

  // Check if the currently logged-in user is the author of this post
  const isAuthor = profile?.role === "admin" && profile?._id === blog.createdBy;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Cover Image */}
        <div className="w-full h-72 md:h-96 relative bg-gray-100">
          <img
            src={blog.blogImage?.url}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
          <span className="absolute top-6 left-6 bg-white/95 backdrop-blur-sm text-blue-700 text-xs font-black uppercase tracking-wider px-4 py-2 rounded-lg shadow-sm">
            {blog.category}
          </span>
        </div>

        <div className="p-8 md:p-12 md:px-16">
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-8 leading-tight tracking-tight">
            {blog.title}
          </h1>

          <div className="flex items-center justify-between border-b border-gray-100 pb-8 mb-10">
            {/* Author Info */}
            <div className="flex items-center gap-4">
              {blog.adminPhoto ? (
                <img
                  src={blog.adminPhoto}
                  alt={blog.adminName}
                  className="w-14 h-14 rounded-full object-cover border border-gray-200"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl">
                  {blog.adminName?.charAt(0)}
                </div>
              )}
              <div>
                <p className="text-lg font-bold text-gray-900">
                  {blog.adminName}
                </p>
                <p className="text-sm font-medium text-gray-500">
                  Published on {new Date(blog.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/*  ADMIN CONTROLS*/}
            {isAuthor && (
              <div className="hidden sm:flex items-center gap-3">
                <Link
                  to={`/update-blog/${blog._id}`}
                  className="bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-700 px-4 py-2 rounded-lg text-sm font-bold transition-colors"
                >
                  Edit Post
                </Link>
                <button
                  onClick={handleDelete}
                  className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-lg text-sm font-bold transition-colors"
                >
                  Delete
                </button>
              </div>
            )}
          </div>

          {/* Blog Body */}
          <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed whitespace-pre-wrap font-medium">
            {blog.about}
          </div>

          {/* Mobile  */}
          {isAuthor && (
            <div className="sm:hidden flex flex-col gap-3 mt-10 pt-8 border-t border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider text-center mb-2">
                Admin Controls
              </p>
              <Link
                to={`/update-blog/${blog._id}`}
                className="w-full text-center bg-gray-100 text-gray-700 px-4 py-3 rounded-xl text-sm font-bold"
              >
                Edit Post
              </Link>
              <button
                onClick={handleDelete}
                className="w-full text-center bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-bold"
              >
                Delete Post
              </button>
            </div>
          )}

          <div className="mt-12 pt-8 border-t border-gray-100 text-center">
            <Link
              to="/"
              className="inline-block bg-gray-900 text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition transform hover:-translate-y-0.5 shadow-md"
            >
              &larr; Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleBlog;
