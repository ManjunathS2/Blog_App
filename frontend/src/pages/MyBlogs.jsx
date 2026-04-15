import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const MyBlogs = () => {
  const [myBlogs, setMyBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyBlogs = async () => {
      try {
        const { data } = await axios.get(
          "https://blog-app-2iif.onrender.com/api/blogs/my-blog",
          { withCredentials: true },
        );
        setMyBlogs(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching my blogs", error);
        setLoading(false);
      }
    };
    fetchMyBlogs();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      const { data } = await axios.delete(
        `https://blog-app-2iif.onrender.com/api/blogs/delete/${id}`,
        { withCredentials: true },
      );
      toast.success(data.message || "Blog deleted successfully");
      setMyBlogs(myBlogs.filter((blog) => blog._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to delete blog");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl font-bold text-gray-500 animate-pulse">
          Loading Your Dashboard...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-8 border-b pb-4">
          My Dashboard
        </h1>
        {myBlogs && myBlogs.length > 0 ? (
          <div className="grid gap-6">
            {myBlogs.map((blog) => (
              <div
                key={blog._id}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-6 items-center"
              >
                <img
                  src={blog.blogImage?.url}
                  alt={blog.title}
                  className="w-full sm:w-40 h-28 object-cover rounded-lg shadow-sm"
                />
                <div className="flex-grow text-center sm:text-left">
                  <span className="text-xs font-bold text-blue-600 uppercase bg-blue-50 px-2 py-1 rounded">
                    {blog.category}
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 mt-2 mb-1">
                    {blog.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Published on {new Date(blog.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                  <Link
                    to={`/update-blog/${blog._id}`}
                    className="flex-1 sm:flex-none text-center bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-bold hover:bg-blue-200 transition"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(blog._id)}
                    className="flex-1 sm:flex-none bg-red-100 text-red-700 px-4 py-2 rounded-lg font-bold hover:bg-red-200 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-600 mb-2">
              No blogs yet!
            </h2>
            <p className="text-gray-500 mb-6">
              You haven't published anything from this account.
            </p>
            <Link
              to="/create-blog"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold"
            >
              Write your first post
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBlogs;
