const db = require("../config/db");
const Brand = require("../models/Brand");

// 1. THIS is the missing function! It ensures the table exists.
const ensureBrandsTable = async () => {
  await db.query(`
        CREATE TABLE IF NOT EXISTS brands (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            image TEXT NOT NULL,
            qty INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
};

exports.getAllBrands = async (req, res) => {
  try {
    await ensureBrandsTable();
    const [rows] = await db.query("SELECT * FROM brands ORDER BY name ASC");
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createBrand = async (req, res) => {
  try {
    // Now it knows what this is!
    await ensureBrandsTable();

    const { name, qty } = req.body;

    // Check if the file was successfully caught by your middleware
    if (!req.file) {
      return res.status(400).json({ message: "Brand logo image is required" });
    }

    // Create the relative path to store in the DB
    const imagePath = `/uploads/brands/${req.file.filename}`;

    // Note: Assuming your Brand model doesn't need to validate the file object itself,
    // just the resulting string path.
    const newBrand = new Brand({ name, image: imagePath, qty });
    const validation = Brand.validate(newBrand);

    if (!validation.isValid) {
      return res
        .status(400)
        .json({ message: "Missing fields", fields: validation.missingFields });
    }

    const [result] = await db.query(
      "INSERT INTO brands (name, image, qty) VALUES (?, ?, ?)",
      [newBrand.name, newBrand.image, newBrand.qty],
    );

    res.status(201).json({
      message: "Brand added",
      id: result.insertId,
      image: imagePath,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM brands WHERE id = ?", [id]);
    res.status(200).json({ message: "Brand deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
