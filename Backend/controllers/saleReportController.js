const path = require("path");
const db = require("../config/db");

let saleReportSchemaSyncPromise = null;

const ensureSaleReportsTable = async () => {
  if (!saleReportSchemaSyncPromise) {
    saleReportSchemaSyncPromise = (async () => {
      await db.query(`
        CREATE TABLE IF NOT EXISTS sale_reports (
          id INT NOT NULL AUTO_INCREMENT,
          customer_name VARCHAR(255) NOT NULL,
          phone VARCHAR(50) NOT NULL,
          email VARCHAR(255) NOT NULL,
          lead_source VARCHAR(255) DEFAULT NULL,
          sold_by VARCHAR(255) DEFAULT NULL,
          plate_number VARCHAR(50) DEFAULT NULL,
          sale_date DATE DEFAULT NULL,
          listing_id INT DEFAULT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          PRIMARY KEY (id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      // Add listing_id column if it doesn't exist
      try {
        const [columns] = await db.query("SHOW COLUMNS FROM sale_reports WHERE Field = 'listing_id'");
        if (!columns.length) {
          console.log("📌 Adding listing_id column to sale_reports table");
          await db.query(`ALTER TABLE sale_reports ADD COLUMN listing_id INT DEFAULT NULL`);
          console.log("✅ listing_id column added");
        }
      } catch (err) {
        console.log("ℹ️ listing_id column already exists or error:", err.message);
      }
    })().catch((error) => {
      saleReportSchemaSyncPromise = null;
      throw error;
    });
  }

  return saleReportSchemaSyncPromise;
};

const mapNullableString = (value) => {
  if (value === undefined || value === null) return null;
  const trimmed = String(value).trim();
  return trimmed === "" ? null : trimmed;
};

// ─── CREATE ───────────────────────────────────────────────────────────────────
exports.createSaleReport = async (req, res) => {
  const customer_name = mapNullableString(req.body.customer_name);
  const phone         = mapNullableString(req.body.phone);
  const email         = mapNullableString(req.body.email);
  const lead_source   = mapNullableString(req.body.lead_source);
  const sold_by       = mapNullableString(req.body.sold_by);
  const plate_number  = mapNullableString(req.body.plate_number);
  const sale_date     = mapNullableString(req.body.sale_date);
  let listing_id      = req.body.listing_id ? Number(req.body.listing_id) : null;

  console.log("📝 Sale Report Details:", { customer_name, phone, email, listing_id, plate_number });

  if (!customer_name || !phone || !email) {
    return res.status(400).json({ message: "Customer name, phone and email are required." });
  }

  try {
    await ensureSaleReportsTable();

    // Fallback: resolve listing_id by plate_number if listing_id is null
    if (!listing_id && plate_number) {
      const [found] = await db.execute(
        `SELECT id FROM listings WHERE plate_number = ?`,
        [plate_number]
      );
      if (found.length) {
        listing_id = found[0].id;
        console.log("✅ Resolved listing_id from plate_number:", listing_id);
      }
    }

    const [result] = await db.execute(
      `INSERT INTO sale_reports
        (customer_name, phone, email, lead_source, sold_by, plate_number, sale_date, listing_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [customer_name, phone, email, lead_source, sold_by, plate_number, sale_date, listing_id]
    );

    console.log("✅ Sale report created with ID:", result.insertId);

    if (listing_id) {
      console.log("🔄 Marking listing as sold. Listing ID:", listing_id);
      const [updateResult] = await db.execute(
        `UPDATE listings SET is_sold = TRUE WHERE id = ?`,
        [listing_id]
      );
      console.log("✅ Update result:", updateResult);
    } else {
      console.log("⚠️ No listing_id provided or found, skipping update");
    }

    res.status(201).json({
      message: "Sale report entry created successfully.",
      id: result.insertId,
    });
  } catch (error) {
    console.error("❌ Error creating sale report:", error.message);
    res.status(500).json({ message: "Database error", error: error.message });
  }
};

// ─── READ ALL ─────────────────────────────────────────────────────────────────
exports.getSaleReports = async (req, res) => {
  try {
    await ensureSaleReportsTable();

    const [rows] = await db.execute(
      `SELECT id, customer_name, phone, email, lead_source, sold_by, plate_number, sale_date, listing_id, created_at
       FROM sale_reports
       ORDER BY sale_date DESC, created_at DESC`
    );

    res.json(rows);
  } catch (error) {
    console.error("❌ Error fetching sale reports:", error.message);
    res.status(500).json({ message: "Database error", error: error.message });
  }
};

// ─── UPDATE ───────────────────────────────────────────────────────────────────
exports.updateSaleReport = async (req, res) => {
  const reportId = Number(req.params.id);

  if (!reportId) {
    return res.status(400).json({ message: "Invalid report ID" });
  }

  const customer_name = mapNullableString(req.body.customer_name);
  const phone         = mapNullableString(req.body.phone);
  const email         = mapNullableString(req.body.email);
  const lead_source   = mapNullableString(req.body.lead_source);
  const sold_by       = mapNullableString(req.body.sold_by);
  const plate_number  = mapNullableString(req.body.plate_number);
  const sale_date     = mapNullableString(req.body.sale_date);

  if (!customer_name || !phone || !email) {
    return res.status(400).json({ message: "Customer name, phone and email are required." });
  }

  try {
    await ensureSaleReportsTable();

    // Fetch the existing record so we can handle listing_id changes
    const [existing] = await db.execute(
      `SELECT listing_id, plate_number FROM sale_reports WHERE id = ?`,
      [reportId]
    );

    if (!existing.length) {
      return res.status(404).json({ message: "Sale report not found" });
    }

    let old_listing_id = existing[0].listing_id;
    const old_plate = existing[0].plate_number;

    // Fallback for old_listing_id by plate if it was null
    if (!old_listing_id && old_plate) {
      const [foundOld] = await db.execute(
        `SELECT id FROM listings WHERE plate_number = ?`,
        [old_plate]
      );
      if (foundOld.length) old_listing_id = foundOld[0].id;
    }

    // Determine target listing_id for updated report (preserve old if not provided)
    let new_listing_id = req.body.listing_id !== undefined
      ? (req.body.listing_id ? Number(req.body.listing_id) : null)
      : old_listing_id;

    // Fallback for new_listing_id by plate_number if null
    if (!new_listing_id && plate_number) {
      const [foundNew] = await db.execute(
        `SELECT id FROM listings WHERE plate_number = ?`,
        [plate_number]
      );
      if (foundNew.length) new_listing_id = foundNew[0].id;
    }

    // If still null, fall back to old_listing_id
    if (!new_listing_id && old_listing_id) {
      new_listing_id = old_listing_id;
    }

    // Update the sale report
    const [result] = await db.execute(
      `UPDATE sale_reports
         SET customer_name = ?,
             phone         = ?,
             email         = ?,
             lead_source   = ?,
             sold_by       = ?,
             plate_number  = ?,
             sale_date     = ?,
             listing_id    = ?
       WHERE id = ?`,
      [customer_name, phone, email, lead_source, sold_by, plate_number, sale_date, new_listing_id, reportId]
    );

    console.log("✅ Sale report updated. Rows affected:", result.affectedRows);

    // Handle listing sold-status changes
    if (old_listing_id && old_listing_id !== new_listing_id) {
      // Re-check if old_listing_id is referenced by any OTHER sale_report
      const [otherReports] = await db.execute(
        `SELECT id FROM sale_reports WHERE listing_id = ? AND id != ?`,
        [old_listing_id, reportId]
      );
      if (!otherReports.length) {
        console.log("🔄 Releasing old listing ID:", old_listing_id);
        await db.execute(
          `UPDATE listings SET is_sold = NULL WHERE id = ?`,
          [old_listing_id]
        );
      }
    }

    // ALWAYS ensure the target listing remains marked as sold (is_sold = TRUE)
    if (new_listing_id) {
      console.log("🔄 Ensuring listing remains marked as sold. Listing ID:", new_listing_id);
      await db.execute(
        `UPDATE listings SET is_sold = TRUE WHERE id = ?`,
        [new_listing_id]
      );
    }

    res.status(200).json({
      message: "Sale report updated successfully.",
      id: reportId,
    });
  } catch (error) {
    console.error("❌ Error updating sale report:", error.message);
    res.status(500).json({ message: "Database error", error: error.message });
  }
};

// ─── DELETE ───────────────────────────────────────────────────────────────────
exports.deleteSaleReport = async (req, res) => {
  const reportId = Number(req.params.id);

  if (!reportId) {
    return res.status(400).json({ message: "Invalid report ID" });
  }

  try {
    await ensureSaleReportsTable();

    const [reports] = await db.execute(
      `SELECT listing_id, plate_number FROM sale_reports WHERE id = ?`,
      [reportId]
    );

    if (!reports.length) {
      return res.status(404).json({ message: "Sale report not found" });
    }

    let listing_id      = reports[0].listing_id;
    const plate_number  = reports[0].plate_number;

    console.log("🗑️ Deleting sale report ID:", reportId, "Listing ID:", listing_id, "Plate:", plate_number);

    // Fallback: find listing by plate_number if listing_id is null
    if (!listing_id && plate_number) {
      console.log("📍 listing_id is null, finding listing by plate_number:", plate_number);
      const [listings] = await db.execute(
        `SELECT id FROM listings WHERE plate_number = ?`,
        [plate_number]
      );
      if (listings.length) {
        listing_id = listings[0].id;
        console.log("✅ Found listing ID by plate_number:", listing_id);
      }
    }

    await db.execute(`DELETE FROM sale_reports WHERE id = ?`, [reportId]);
    console.log("✅ Sale report deleted");

    if (listing_id) {
      // Check if another sale report exists for this listing before resetting is_sold
      const [otherReports] = await db.execute(
        `SELECT id FROM sale_reports WHERE listing_id = ?`,
        [listing_id]
      );
      if (!otherReports.length) {
        console.log("🔄 Resetting listing is_sold to NULL. Listing ID:", listing_id);
        const [updateResult] = await db.execute(
          `UPDATE listings SET is_sold = NULL WHERE id = ?`,
          [listing_id]
        );
        console.log("✅ Listing is_sold reset. Rows affected:", updateResult.affectedRows);
      } else {
        console.log("ℹ️ Listing still referenced by another sale report, keeping is_sold = TRUE");
      }
    } else {
      console.log("⚠️ No listing_id or plate_number found, skipping listing update");
    }

    res.status(200).json({
      message: "Sale report deleted successfully.",
    });
  } catch (error) {
    console.error("❌ Error deleting sale report:", error.message);
    res.status(500).json({ message: "Database error", error: error.message });
  }
};