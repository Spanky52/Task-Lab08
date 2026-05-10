import db from "../models/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import authConfig from "../config/auth.config.js";

const { user: User, role: Role } = db;

export const signup = async (req, res) => {
  try {
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, 8)
    });

    if (req.body.roles) {
      const roles = await Role.findAll({
        where: {
          name: req.body.roles
        }
      });

      await user.setRoles(roles);
    } else {
      const role = await Role.findOne({
        where: { name: "user" }
      });

      await user.setRoles([role]);
    }

    res.status(201).json({
      message: "User registered successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const signin = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { username: req.body.username },
      include: "roles"
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const valid = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!valid) {
      return res.status(401).json({
        message: "Invalid password"
      });
    }

    const token = jwt.sign(
      { id: user.id },
      authConfig.secret,
      { expiresIn: 86400 }
    );

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      roles: user.roles.map(r => r.name),
      accessToken: token
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};