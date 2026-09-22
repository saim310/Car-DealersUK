const db = require("../config/db");

const ensureFooterTable = async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS footer_settings (
      id INT PRIMARY KEY DEFAULT 1,
      customer_service JSON,
      why_2cc JSON,
      for_investors JSON,
      newsletter_text TEXT,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
};

exports.getFooter = async (req, res) => {
  try {
    await ensureFooterTable();
    const [rows] = await db.query("SELECT * FROM footer_settings WHERE id = 1");

    // If no row exists yet, return empty/default arrays
    if (rows.length === 0) {
      return res.status(200).json({
        customer_service: [],
        why_2cc: [],
        for_investors: [],
        newsletter_text: "Stay up to date with special offers!",
      });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateFooter = async (req, res) => {
  try {
    await ensureFooterTable();
    const { customer_service, why_2cc, for_investors, newsletter_text } =
      req.body;

    // Convert JavaScript arrays to JSON strings for MySQL insertion
    const csJson = JSON.stringify(customer_service || []);
    const whyJson = JSON.stringify(why_2cc || []);
    const invJson = JSON.stringify(for_investors || []);

    // Check if row exists
    const [existing] = await db.query(
      "SELECT id FROM footer_settings WHERE id = 1",
    );

    if (existing.length === 0) {
      // Insert new row if table is empty
      await db.query(
        "INSERT INTO footer_settings (id, customer_service, why_2cc, for_investors, newsletter_text) VALUES (1, ?, ?, ?, ?)",
        [csJson, whyJson, invJson, newsletter_text],
      );
    } else {
      // Update existing row
      await db.query(
        "UPDATE footer_settings SET customer_service = ?, why_2cc = ?, for_investors = ?, newsletter_text = ? WHERE id = 1",
        [csJson, whyJson, invJson, newsletter_text],
      );
    }

    res.status(200).json({ message: "Footer updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
