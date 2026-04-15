import express from "express";
import {
  createBlog,
  deleteBlog,
  getAllBlogs,
  getMyBlogs,
  getSingleBlogs,
  updateBlog,
  generateAIContent,
} from "../controllers/blog.controller.js";
import { isAdmin, isAuthenticated } from "../middleware/authUser.js";

const router = express.Router();

// AI Route
router.post(
  "/ai-generate",
  isAuthenticated,
  isAdmin("admin"),
  generateAIContent,
);

//  RESTRICTED CRUD ROUTES (Only Admins can create and manage blogs)
router.post("/create", isAuthenticated, isAdmin("admin"), createBlog);
router.get("/my-blog", isAuthenticated, isAdmin("admin"), getMyBlogs);
router.put("/update/:id", isAuthenticated, isAdmin("admin"), updateBlog);
router.delete("/delete/:id", isAuthenticated, isAdmin("admin"), deleteBlog);

//  PUBLIC ROUTES (Anyone can read)
router.get("/all-blogs", getAllBlogs);
router.get("/single-blog/:id", getSingleBlogs);

export default router;
