import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import createTokenAndSaveCookies from "../jwt/AuthToken.js";
import path from "path";

// --- Register a New User ---
export const register = async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: "User photo is required" });
    }

    const { photo } = req.files;
    const allowedFormats = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedFormats.includes(photo.mimetype)) {
      return res.status(400).json({
        message: "Invalid photo format. Only jpg, png, and webp are allowed",
      });
    }

    const { email, name, password, phone, education, role } = req.body;

    if (
      !email ||
      !name ||
      !password ||
      !phone ||
      !education ||
      !role ||
      !photo
    ) {
      return res
        .status(400)
        .json({ message: "Please fill all required fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }

    const cleanFileName = photo.name.replace(/\s+/g, "_");
    const uniqueFilename = `${Date.now()}-${cleanFileName}`;
    const uploadPath = `./public/uploads/${uniqueFilename}`;

    await photo.mv(uploadPath);

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Construct database document saving the local URL
    const newUser = new User({
      email,
      name,
      password: hashedPassword,
      phone,
      education,
      role,
      photo: {
        public_id: uniqueFilename,
        url: `https://blog-app-2iif.onrender.com/uploads/${uniqueFilename}`,
      },
    });

    await newUser.save();

    // Generate JWT and attach to cookie
    const token = await createTokenAndSaveCookies(newUser._id, res);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        photo: newUser.photo.url,
      },
      token: token,
    });
  } catch (error) {
    console.log("REGISTRATION ERROR:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// --- Login User ---
export const login = async (req, res) => {
  const { email, password, role } = req.body;
  try {
    if (!email || !password || !role) {
      return res
        .status(400)
        .json({ message: "Please fill all required fields" });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (user.role !== role) {
      return res
        .status(400)
        .json({ message: `Role mismatch. Expected ${role}` });
    }

    const token = await createTokenAndSaveCookies(user._id, res);

    res.status(200).json({
      message: "User logged in successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        photo: user.photo.url,
      },
      token: token,
    });
  } catch (error) {
    console.log("LOGIN ERROR:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// --- Logout User ---
export const logout = (req, res) => {
  try {
  
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: true, 
      sameSite: "none", 
    });
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// --- Get Current Profile ---
export const getMyProfile = async (req, res) => {
  res.status(200).json({ user: req.user });
};

// --- Get All Admins ---
export const getAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: "admin" });
    res.status(200).json({ admins });
  } catch (error) {
    console.log("Error fetching admins:", error);
    res.status(500).json({ error: "Failed to fetch creators" });
  }
};
