import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CreateBlog = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [about, setAbout] = useState("");
  const [blogImage, setBlogImage] = useState(null);
  const [blogImagePreview, setBlogImagePreview] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  
  const categories = [
    "Technology",
    "Lifestyle",
    "Education",
    "Health",
    "Sports",
    "Business",
    "Travel",
  ];

  // Calculate characters
  const characterCount = about.length;
  const isContentValid = characterCount >= 200;

  const changePhotoHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBlogImage(file);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => setBlogImagePreview(reader.result);
    }
  };

  const handleAIGenerate = async () => {
    if (!title || !category) {
      toast.error("Please enter a Title and select a Category first!");
      return;
    }

    setIsGenerating(true);
    const toastId = toast.loading("AI is writing your blog...");

    try {
      const { data } = await axios.post(
        "http://localhost:4001/api/blogs/ai-generate",
        { title, category },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        },
      );
      setAbout(data.generatedContent);
      toast.success("AI content generated!", { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to generate AI content",
        { id: toastId },
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreateBlog = async (e) => {
    e.preventDefault();

    if (!isContentValid) {
      toast.error("Content must be at least 200 characters long!");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("about", about);
    formData.append("blogImage", blogImage);

    try {
      const { data } = await axios.post(
        "http://localhost:4001/api/blogs/create",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      toast.success(data.message || "Blog created successfully!");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create blog");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white p-10 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8 border-b pb-4 text-center">
          Publish New Article
        </h2>
        <form onSubmit={handleCreateBlog} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Blog Title
              </label>
              <input
                type="text"
                placeholder="Article Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-end mb-2">
              <label className="block text-sm font-bold text-gray-700">
                Content
              </label>
              <button
                type="button"
                onClick={handleAIGenerate}
                disabled={isGenerating}
                className={`text-sm px-4 py-1.5 rounded-lg font-bold transition flex items-center gap-2 ${isGenerating ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-purple-100 text-purple-700 hover:bg-purple-200 border border-purple-300"}`}
              >
                {isGenerating ? "Generating..." : "✨ Auto-Write with AI"}
              </button>
            </div>
            <textarea
              placeholder="What's on your mind? (Min 200 characters)"
              rows="8"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 outline-none transition ${isContentValid ? "border-gray-300 focus:ring-blue-500" : "border-red-300 focus:ring-red-500"}`}
              required
            ></textarea>

            <div className="flex justify-end mt-1">
              <span
                className={`text-xs font-bold ${isContentValid ? "text-green-600" : "text-red-500"}`}
              >
                {characterCount} / 200 characters
              </span>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl border-2 border-dashed border-gray-200">
            <label className="block text-sm font-bold text-gray-700 mb-3 text-center">
              Featured Image
            </label>
            <div className="flex flex-col items-center gap-4">
              {blogImagePreview && (
                <img
                  src={blogImagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg shadow-md"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={changePhotoHandler}
                className="text-sm text-gray-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!isContentValid}
            className={`w-full py-4 text-white font-black text-lg rounded-xl transition shadow-lg 
              ${
                isContentValid
                  ? "bg-blue-600 hover:bg-blue-700 transform hover:-translate-y-1 cursor-pointer"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
          >
            {isContentValid ? "PUBLISH BLOG" : "WRITE MORE TO PUBLISH"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateBlog;
