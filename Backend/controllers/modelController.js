const db = require("../config/db");

let modelsSchemaSyncPromise = null;

const ensureModelsTable = async () => {
  if (!modelsSchemaSyncPromise) {
    modelsSchemaSyncPromise = (async () => {
      await db.query(`
        CREATE TABLE IF NOT EXISTS models (
          id INT NOT NULL AUTO_INCREMENT,
          name VARCHAR(255) NOT NULL,
          brand_id INT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (id),
          FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE CASCADE,
          UNIQUE KEY unique_model_brand (name, brand_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);
    })().catch((error) => {
      modelsSchemaSyncPromise = null;
      throw error;
    });
  }

  return modelsSchemaSyncPromise;
};

exports.getModelsByBrand = async (req, res) => {
  const { brandId } = req.params;

  if (!brandId) {
    return res.status(400).json({ message: "Brand ID is required." });
  }

  try {
    await ensureModelsTable();
    const [rows] = await db.execute(
      "SELECT id, name FROM models WHERE brand_id = ? ORDER BY name ASC",
      [brandId]
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Database error" });
  }
};

exports.createModel = async (req, res) => {
  const { name, brand_id } = req.body;

  if (!name || !brand_id) {
    return res.status(400).json({ message: "Model name and brand ID are required." });
  }

  try {
    await ensureModelsTable();
    const [result] = await db.execute(
      "INSERT INTO models (name, brand_id) VALUES (?, ?)",
      [name, brand_id]
    );
    res.status(201).json({
      message: "Model created successfully.",
      id: result.insertId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Database error" });
  }
};
