import jwt from "jsonwebtoken";
import db from "../models/index.js";
import authConfig from "../config/auth.config.js";

const { user: User } = db;

export const verifyToken = async (req, res, next) => {
  let token =
    req.headers["x-access-token"] ||
    req.headers["authorization"];

  if (!token) {
    return res.status(403).json({
      message: "No token provided"
    });
  }

  token = token.replace("Bearer ", "");

  try {
    const decoded = jwt.verify(
      token,
      authConfig.secret
    );

    req.userId = decoded.id;

    next();
  } catch {
    return res.status(401).json({
      message: "Unauthorized"
    });
  }
};

export const isAdmin = async (req, res, next) => {
  const user = await User.findByPk(req.userId);
  const roles = await user.getRoles();

  if (roles.some(r => r.name === "admin")) {
    return next();
  }

  res.status(403).json({
    message: "Require Admin Role"
  });
};

export const isModerator = async (req, res, next) => {
  const user = await User.findByPk(req.userId);
  const roles = await user.getRoles();

  if (roles.some(r => r.name === "moderator")) {
    return next();
  }

  res.status(403).json({
    message: "Require Moderator Role"
  });
};