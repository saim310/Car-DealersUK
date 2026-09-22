const db = require("../config/db");

let bodyTypesSchemaSyncPromise = null;

const ensureBodyTypesTable = async () => {
  if (!bodyTypesSchemaSyncPromise) {
    bodyTypesSchemaSyncPromise = (async () => {
      await db.query(`
        CREATE TABLE IF NOT EXISTS body_types (
          id INT NOT NULL AUTO_INCREMENT,
          name VARCHAR(255) NOT NULL UNIQUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);
    })().catch((error) => {
      bodyTypesSchemaSyncPromise = null;
      throw error;
    });
  }

  return bodyTypesSchemaSyncPromise;
};

exports.getAllBodyTypes = async (req, res) => {
  try {
    await ensureBodyTypesTable();
    const [rows] = await db.query("SELECT * FROM body_types ORDER BY name ASC");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Database error" });
  }
};

exports.createBodyType = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Body type name is required." });
  }

  try {
    await ensureBodyTypesTable();
    const [result] = await db.execute(
      "INSERT INTO body_types (name) VALUES (?)",
      [name]
    );
    res.status(201).json({
      message: "Body type created successfully.",
      id: result.insertId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Database error" });
  }
};
