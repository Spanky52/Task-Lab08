import db from "../models/index.js";

const { ROLES, user: User } = db;

export const checkDuplicateUsernameOrEmail = async (req, res, next) => {
  try {
    const username = await User.findOne({
      where: { username: req.body.username }
    });

    if (username) {
      return res.status(400).json({
        message: "Username already exists"
      });
    }

    const email = await User.findOne({
      where: { email: req.body.email }
    });

    if (email) {
      return res.status(400).json({
        message: "Email already exists"
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (const role of req.body.roles) {
      if (!ROLES.includes(role)) {
        return res.status(400).json({
          message: `Role ${role} does not exist`
        });
      }
    }
  }

  next();
};