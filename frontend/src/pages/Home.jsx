import React, { useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { Link } from "react-router-dom";

const Home = () => {
  const { profile, blogs } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All",
    "Technology",
    "Lifestyle",
    "Education",
    "Health",
    "Sports",
    "Business",
    "Travel",
  ];

  const filteredBlogs = blogs?.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.about.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || blog.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50/50 pb-16">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-2">
              Explore the <span className="text-blue-600">Future</span> of Tech
              & Life.
            </h1>
            <p className="text-base text-gray-500 max-w-xl">
              Welcome {profile?.name ? `back, ${profile.name}` : "to BrainFizz"}
              . Discover insights, stories, and ideas from our amazing creators.
            </p>
          </div>

          {profile?.role === "admin" && (
            <div className="w-full md:w-auto mt-4 md:mt-0">
              <Link
                to="/create-blog"
                className="block w-full md:w-auto text-center bg-gray-900 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-gray-800 transition shadow-lg transform hover:-translate-y-0.5"
              >
                Write an Article ✨
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Search & Filter Tools */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex overflow-x-auto pb-2 md:pb-0 gap-2 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-4 py-1.5 rounded-full font-bold text-sm transition-all duration-200 ${
                  selectedCategory === cat
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-64 flex-shrink-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-4 w-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition bg-white shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Blog Feed */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredBlogs && filteredBlogs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredBlogs.map((blog) => (
              <Link
                to={`/blog/${blog._id}`}
                key={blog._id}
                className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                  <img
                    src={blog.blogImage?.url}
                    alt={blog.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-white/95 backdrop-blur-sm text-blue-700 text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded shadow-sm">
                      {blog.category}
                    </span>
                  </div>
                </div>

                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">
                    {blog.title}
                  </h3>
                  <p className="text-gray-500 text-xs line-clamp-2 mb-4 flex-grow leading-relaxed">
                    {blog.about}
                  </p>

                  <div className="flex items-center gap-2 pt-3 border-t border-gray-50 mt-auto">
                    {blog.adminPhoto ? (
                      <img
                        src={blog.adminPhoto}
                        alt={blog.adminName}
                        className="w-6 h-6 rounded-full object-cover border border-gray-200"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                        {blog.adminName?.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-bold text-gray-900 leading-none">
                        {blog.adminName}
                      </p>
                      <p className="text-[10px] font-medium text-gray-400 mt-0.5">
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              No results found
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              We couldn't find any articles matching your search.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="bg-blue-100 text-blue-700 px-5 py-2 rounded-lg text-sm font-bold hover:bg-blue-200 transition"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
