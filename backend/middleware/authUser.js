import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

// 1. Authenticate User 
export const isAuthenticated = async (req, res, next) => {
  try {

    const token = req.cookies.jwt;

    if (!token) {
      return res
        .status(401)
        .json({ error: "User not authenticated. No token provided." });
    }


    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    req.user = user;


    next();
  } catch (error) {
    console.log("Authentication Error: ", error);
    return res
      .status(401)
      .json({ error: "User not authenticated. Invalid token." });
  }
};

// 2. Authorize Admin 
export const isAdmin = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({
          error: `Access denied. Role '${req.user.role}' is not authorized.`,
        });
    }
    next();
  };
};
