import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import db from "./app/models/index.js";
import authRoutes from "./app/routes/auth.routes.js";
import userRoutes from "./app/routes/user.routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/test", userRoutes);

const PORT = process.env.PORT || 3000;

db.sequelize.sync({ force: false }).then(async () => {
  console.log("Database synced");

  const Role = db.role;

  await Role.findOrCreate({ where: { name: "user" } });
  await Role.findOrCreate({ where: { name: "admin" } });
  await Role.findOrCreate({ where: { name: "moderator" } });

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((error) => {
  console.error("Database connection error:", error);
});