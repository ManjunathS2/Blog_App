import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { Link } from "react-router-dom";

const Creators = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const { blogs } = useAuth();

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4001/api/users/admins",
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          },
        );

        if (data && data.admins) {
          setAdmins(data.admins);
        } else if (Array.isArray(data)) {
          setAdmins(data);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching creators:", error);
        setErrorMsg(error.message || "Network Error");
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl font-bold text-gray-500 animate-pulse">
          Loading Creators...
        </p>
      </div>
    );

  if (errorMsg) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 p-6">
        <h2 className="text-2xl font-black text-red-600 mb-2">
          Connection Error
        </h2>
        <code className="mt-2 p-3 bg-white border border-red-200 rounded-lg text-red-500 text-sm font-bold shadow-sm">
          {errorMsg}
        </code>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            Meet Our <span className="text-blue-600">Creators</span>
          </h1>
          <p className="text-base text-gray-600">
            The brilliant minds behind the articles on CilliBlog.
          </p>
        </div>

        {admins && admins.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {admins.map((admin) => {
              const adminBlogs =
                blogs?.filter((blog) => blog.createdBy === admin._id) || [];

              return (
                <div
                  key={admin._id}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 p-5 flex flex-col h-full"
                >
                  {/*  Admin Profile */}
                  <div className="flex items-center gap-4 border-b border-gray-100 pb-4 mb-4">
                    <img
                      src={admin.photo?.url}
                      alt={admin.name}
                      className="w-16 h-16 object-cover rounded-full border-2 border-blue-50"
                    />
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 leading-tight">
                        {admin.name}
                      </h2>
                      <div className="flex flex-wrap items-center gap-2 mt-1.5">
                        <span className="bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow-sm">
                          {admin.role}
                        </span>
                        <span className="text-xs font-semibold text-gray-500 bg-gray-50 px-2 py-0.5 rounded">
                          🎓 {admin.education}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Admin's Blog Portfolio */}
                  <div className="flex-grow flex flex-col">
                    <h3 className="text-sm font-bold text-gray-800 mb-3">
                      Latest Articles
                    </h3>

                    {adminBlogs.length > 0 ? (
                      <div className="space-y-3">
                        {/* Only show the top 2 latest articles  */}
                        {adminBlogs.slice(0, 2).map((blog) => (
                          <Link
                            to={`/blog/${blog._id}`}
                            key={blog._id}
                            className="flex flex-row items-center gap-3 bg-gray-50/50 border border-gray-100 p-2 rounded-lg hover:bg-blue-50 hover:border-blue-100 transition-colors group"
                          >
                            <img
                              src={blog.blogImage?.url}
                              alt="thumbnail"
                              className="w-10 h-10 rounded object-cover bg-gray-200 flex-shrink-0"
                            />
                            <div className="flex-grow overflow-hidden">
                              <h4 className="font-bold text-xs text-gray-900 line-clamp-1 group-hover:text-blue-700 transition-colors">
                                {blog.title}
                              </h4>
                              <p className="text-[10px] font-medium text-gray-500 mt-0.5">
                                {new Date(blog.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </Link>
                        ))}

                        {adminBlogs.length > 2 && (
                          <div className="text-center pt-2">
                            <span className="text-xs font-bold text-blue-600 hover:text-blue-800 cursor-pointer">
                              + {adminBlogs.length - 2} more
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex-grow flex items-center justify-center bg-gray-50 border border-dashed border-gray-200 rounded-lg p-4">
                        <p className="text-xs font-medium text-gray-400 italic">
                          No articles published yet.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
            <h2 className="text-xl font-bold text-gray-600 mb-1">
              No creators found.
            </h2>
            <p className="text-gray-500 text-sm">
              React checked the state, and the admins array is currently empty.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Creators;
