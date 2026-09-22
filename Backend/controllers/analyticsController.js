const db = require("../config/db");

// Log a page visit
exports.logPageVisit = async (req, res) => {
  const { path } = req.body;
  try {
    await db.execute(
      `INSERT INTO page_analytics (page_path, visit_count) 
             VALUES (?, 1) 
             ON DUPLICATE KEY UPDATE visit_count = visit_count + 1`,
      [path],
    );
    res.status(200).json({ message: "Visit logged" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.logPropertyView = async (req, res) => {
  const { listingId, title } = req.body;
  const cleanId = parseInt(listingId, 10);
  const cleanTitle = title ?? "Untitled Property";

  if (isNaN(cleanId)) {
    return res.status(400).json({ message: "Invalid or missing listingId" });
  }

  try {
    await db.execute(
      `INSERT INTO property_analytics (listing_id, listing_title, view_count) 
             VALUES (?, ?, 1) 
             ON DUPLICATE KEY UPDATE view_count = view_count + 1`,
      [cleanId, cleanTitle],
    );
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Database Error Details:", error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.getAnalyticsStats = async (req, res) => {
  try {
    const [topPages] = await db.execute(
      "SELECT page_path, visit_count FROM page_analytics ORDER BY visit_count DESC LIMIT 10",
    );
    const [rows] = await db.execute(`
      SELECT 
        pa.listing_id, 
        pa.view_count, 
        l.listing_title, 
        l.price, 
        l.brand, 
        l.images_json,
        l.condition
      FROM property_analytics pa
      INNER JOIN listings l ON pa.listing_id = l.id
      ORDER BY pa.view_count DESC 
      LIMIT 10
    `);

    const topProperties = rows.map((prop) => {
      let images = [];
      try {
        images = JSON.parse(prop.images_json || "[]");
      } catch (e) {
        images = [];
      }

      // Fix double 'uploads/' prefix if present
      const firstImg = images[0] || "";
      const pathPart = firstImg.startsWith("uploads/")
        ? firstImg
        : `uploads/${firstImg}`;

      return {
        ...prop,
        thumbnail: firstImg
          ? `${req.protocol}://${req.get("host")}/${pathPart}`
          : null,
        price: parseFloat(prop.price) || 0,
      };
    });

    res.json({ topPages, topProperties });
  } catch (error) {
    console.error("Analytics Stats Error:", error);
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
};
