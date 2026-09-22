const db = require('../config/db');

// Create Lead
exports.createLead = async (req, res) => {
  const { full_name, email, phone, message, listing_id, plate_number, status } = req.body;

  if (!full_name || !email || !phone || !message || !listing_id || !plate_number || !status) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const [result] = await db.execute(
      'INSERT INTO leads (full_name, email, phone, message, listing_id, plate_number, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [full_name, email, phone, message, listing_id, plate_number, status]
    );
    res.status(201).json({ message: "Lead saved successfully", id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Database error" });
  }
};

// Get All Leads
exports.getLeads = async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT leads.id, leads.full_name, leads.email, leads.phone, leads.message, leads.listing_id, leads.plate_number, listings.listing_title, leads.created_at, listings.status
       FROM leads
       LEFT JOIN listings ON leads.listing_id = listings.id
       ORDER BY leads.created_at DESC`
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Database error" });
  }
};

// Update Lead
// Update Lead
exports.updateLead = async (req, res) => {
  const { id } = req.params;
  const { full_name, email, phone, message, listing_id, plate_number, status } = req.body;

  try {
    const [result] = await db.execute(
      `UPDATE leads 
       SET full_name = ?, email = ?, phone = ?, message = ?, listing_id = ?, plate_number = ?, status = ?
       WHERE id = ?`,
      [full_name, email, phone, message, listing_id, plate_number, status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Lead not found" });
    }

    res.json({ message: "Lead updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Database error during update" });
  }
};
// Delete Lead
exports.deleteLead = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.execute('DELETE FROM leads WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Lead not found" });
    }

    res.json({ message: "Lead deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Database error during deletion" });
  }
};