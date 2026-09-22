require("dotenv").config({ path: require("path").join(__dirname, "../.env") });

const bcrypt = require("bcryptjs");
const db = require("../config/db");
const User = require("../models/userModel");

const seedAdminUser = async () => {
  try {
    const name = process.env.ADMIN_NAME || "Admin";
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required in .env");
    }

    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(120) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(30) NOT NULL DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const totalUsers = await User.countUsers();
    if (totalUsers > 0) {
      console.log("Seed skipped: users table already has data.");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.createUser({
      name,
      email,
      password: hashedPassword,
      role: "admin",
    });

    console.log("Admin user seeded successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Failed to seed admin user:", error.message);
    process.exit(1);
  }
};

seedAdminUser();
