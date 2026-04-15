import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const createTokenAndSaveCookies = async (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: true,       
    sameSite: "none",   
    maxAge: 7 * 24 * 60 * 60 * 1000, 
  });
  
  return token; 
};
export default createTokenAndSaveCookies;
