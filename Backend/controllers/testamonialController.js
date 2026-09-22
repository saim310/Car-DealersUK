const db = require("../config/db");
const fs = require("fs/promises");
const path = require("path");

const REVIEW_FIELD_TYPES = {
  user_id: "INT",
  author_name: "VARCHAR(255)",
  author_email: "VARCHAR(255)",
  rating: "INT",
  category: "VARCHAR(100)",
  title: "VARCHAR(255)",
  review_text: "LONGTEXT",
  images_json: "LONGTEXT",
  location: "VARCHAR(255)",
};

let testamonialschemaSyncPromise;

const quoteIdentifier = (identifier) => `\`${identifier}\``;

const parseJSONArray = (value) => {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.filter(Boolean).map((item) => String(item));
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed)
        ? parsed.filter(Boolean).map((item) => String(item))
        : [];
    } catch (_error) {
      return [];
    }
  }

  return [];
};

const normalizeStoredPath = (value) => {
  if (!value) {
    return null;
  }

  let normalized = String(value).trim().replace(/\\/g, "/");

  if (/^https?:\/\//i.test(normalized)) {
    try {
      normalized = new URL(normalized).pathname;
    } catch (_error) {
      // keep original normalized value if URL parsing fails
    }
  }

  const uploadsMarker = "/uploads/";
  const markerIndex = normalized.toLowerCase().lastIndexOf(uploadsMarker);

  if (markerIndex !== -1) {
    return normalized.slice(markerIndex + 1).replace(/^\/+/, "");
  }

  if (normalized.toLowerCase().startsWith("uploads/")) {
    return normalized.replace(/^\/+/, "");
  }

  return normalized.replace(/^\/+/, "");
};

const toPublicFileUrl = (req, storedPath) => {
  const normalized = normalizeStoredPath(storedPath);
  if (!normalized) {
    return null;
  }

  return `${req.protocol}://${req.get("host")}/${normalized}`;
};

const parseStoredPaths = (value) =>
  parseJSONArray(value)
    .map((item) => normalizeStoredPath(item))
    .filter(Boolean);

const formatReviewForResponse = (req, row) => {
  const image_paths = parseStoredPaths(row.images_json);

  return {
    ...row,
    images_json: image_paths.length ? JSON.stringify(image_paths) : null,
    images: image_paths.map((storedPath) => toPublicFileUrl(req, storedPath)),
    image_paths,
  };
};

const removeFiles = async (pathsToDelete) => {
  await Promise.all(
    pathsToDelete.map(async (storedPath) => {
      const normalized = normalizeStoredPath(storedPath);
      if (!normalized) {
        return;
      }

      const absolutePath = path.join(__dirname, "..", normalized);

      try {
        await fs.unlink(absolutePath);
      } catch (error) {
        if (error.code !== "ENOENT") {
          throw error;
        }
      }
    }),
  );
};

const ensuretestamonialsTableColumns = async () => {
  if (!testamonialschemaSyncPromise) {
    testamonialschemaSyncPromise = (async () => {
      await db.query(`
        CREATE TABLE IF NOT EXISTS testamonials (
          id INT NOT NULL AUTO_INCREMENT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          PRIMARY KEY (id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      const [columns] = await db.query(
        "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'testamonials' AND TABLE_SCHEMA = DATABASE()",
      );

      const existingColumns = new Set(
        columns.map((col) => col.COLUMN_NAME.toLowerCase()),
      );

      for (const [fieldName, fieldType] of Object.entries(
        REVIEW_FIELD_TYPES,
      )) {
        if (!existingColumns.has(fieldName.toLowerCase())) {
          const mySQLType = fieldType;
          const nullable =
            fieldName === "user_id" ||
            fieldName === "author_email" ||
            fieldName === "title" ||
            fieldName === "images_json" ||
            fieldName === "location"
              ? "NULL"
              : "NOT NULL";
          await db.query(
            `ALTER TABLE testamonials ADD COLUMN ${quoteIdentifier(fieldName)} ${mySQLType} ${nullable}`,
          );
        }
      }
    })();
  }

  return testamonialschemaSyncPromise;
};

// Create Review
exports.createReview = async (req, res) => {
  try {
    console.log("📌 Creating review...");
    console.log("📋 Request body:", req.body);
    console.log("📁 Uploaded files:", req.files);

    await ensuretestamonialsTableColumns();

    const {
      user_id,
      author_name,
      author_email,
      rating,
      category,
      title,
      review_text,
      location,
    } = req.body;

    // Validate required fields
    if (!author_name || !rating || !review_text) {
      console.warn("⚠️ Missing required fields:", {
        author_name,
        rating,
        review_text,
      });
      return res.status(400).json({
        success: false,
        message: "Missing required fields: author_name, rating, review_text",
      });
    }

    // Validate rating
    const ratingNum = parseInt(rating);
    if (ratingNum < 1 || ratingNum > 5 || !Number.isInteger(ratingNum)) {
      console.warn("⚠️ Invalid rating:", rating);
      return res.status(400).json({
        success: false,
        message: "Rating must be an integer between 1 and 5",
      });
    }

    // Handle uploaded images
    let imagesJson = null;
    if (req.files && req.files.length > 0) {
      console.log("📸 Processing images:", req.files.length);
      const images = req.files.map((file) => file.path);
      imagesJson = JSON.stringify(images);
      console.log("📸 Images JSON:", imagesJson);
    }

    const query = `
      INSERT INTO testamonials (user_id, author_name, author_email, rating, category, title, review_text, images_json, location)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    console.log("💾 Inserting review into database...");
    const [result] = await db.query(query, [
      user_id || null,
      author_name,
      author_email || null,
      ratingNum,
      category || "all",
      title || null,
      review_text,
      imagesJson,
      location || null,
    ]);

    console.log("✅ Review created with ID:", result.insertId);

    // Fetch and return the created review
    const [review] = await db.query(
      "SELECT * FROM testamonials WHERE id = ?",
      [result.insertId],
    );

    console.log("✅ Review retrieval success");

    res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: formatReviewForResponse(req, review[0]),
    });
  } catch (error) {
    console.error("🚨 Create Review Error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating review",
      error: error.message,
    });
  }
};

// Get testamonials by Listing ID
exports.gettestamonialsByListing = async (req, res) => {
  try {
    await ensuretestamonialsTableColumns();

    const { listing_id } = req.params;
    const { category = "all", limit = 10, page = 1 } = req.query;

    // Validate listing exists
    const [listings] = await db.query(
      "SELECT id FROM listings WHERE id = ?",
      [listing_id],
    );

    if (listings.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    let query = "SELECT * FROM testamonials WHERE listing_id = ?";
    const params = [listing_id];

    if (category && category !== "all") {
      query += " AND category = ?";
      params.push(category);
    }

    query += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
    const limitNum = parseInt(limit) || 10;
    const pageNum = parseInt(page) || 1;
    const offset = (pageNum - 1) * limitNum;
    params.push(limitNum, offset);

    const [testamonials] = await db.query(query, params);

    // Get total count
    let countQuery = "SELECT COUNT(*) as total FROM testamonials WHERE listing_id = ?";
    const countParams = [listing_id];

    if (category && category !== "all") {
      countQuery += " AND category = ?";
      countParams.push(category);
    }

    const [countResult] = await db.query(countQuery, countParams);
    const total = countResult[0].total;

    // Get rating summary
    const [ratingSummary] = await db.query(
      `SELECT 
        ROUND(AVG(rating), 1) as average_rating,
        COUNT(*) as total_testamonials,
        SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) as five_star,
        SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) as four_star,
        SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) as three_star,
        SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) as two_star,
        SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) as one_star
      FROM testamonials WHERE listing_id = ?`,
      [listing_id],
    );

    // Get category breakdown
    const [categoryBreakdown] = await db.query(
      `SELECT category, ROUND(AVG(rating), 1) as average_rating, COUNT(*) as count
       FROM testamonials WHERE listing_id = ? GROUP BY category`,
      [listing_id],
    );

    res.json({
      success: true,
      data: testamonials.map((review) => formatReviewForResponse(req, review)),
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
      },
      summary: ratingSummary[0],
      categoryBreakdown,
    });
  } catch (error) {
    console.error("Get testamonials Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching testamonials",
      error: error.message,
    });
  }
};

// Get All testamonials (Admin)
exports.getAlltestamonials = async (req, res) => {
  try {
    await ensuretestamonialsTableColumns();

    const { limit = 20, page = 1, rating } = req.query;

    const limitNum = parseInt(limit) || 20;
    const pageNum = parseInt(page) || 1;
    const offset = (pageNum - 1) * limitNum;

    // Build the WHERE clause for rating filter
    let whereClause = "";
    const queryParams = [];
    
    if (rating && rating !== "all") {
      const ratingNum = parseInt(rating);
      if (!isNaN(ratingNum) && ratingNum >= 1 && ratingNum <= 5) {
        whereClause = " WHERE t.rating = ?";
        queryParams.push(ratingNum);
      }
    }

    const [testamonials] = await db.query(
      `SELECT * FROM testamonials t
      ${whereClause}
      ORDER BY t.created_at DESC LIMIT ? OFFSET ?`,
      [...queryParams, limitNum, offset],
    );

    const [countResult] = await db.query(
      `SELECT COUNT(*) as total FROM testamonials t ${whereClause}`,
      queryParams,
    );
    const total = countResult[0].total;

    res.json({
      success: true,
      data: testamonials.map((review) => formatReviewForResponse(req, review)),
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("Get All testamonials Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching testamonials",
      error: error.message,
    });
  }
};

// Get Single Review
exports.getReviewById = async (req, res) => {
  try {
    await ensuretestamonialsTableColumns();

    const { id } = req.params;

    const [testamonials] = await db.query(
      "SELECT * FROM testamonials WHERE id = ?",
      [id],
    );

    if (testamonials.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    res.json({
      success: true,
      data: formatReviewForResponse(req, testamonials[0]),
    });
  } catch (error) {
    console.error("Get Review Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching review",
      error: error.message,
    });
  }
};

// Update Review
exports.updateReview = async (req, res) => {
  try {
    await ensuretestamonialsTableColumns();

    const { id } = req.params;
    const {
      author_name,
      author_email,
      rating,
      category,
      title,
      review_text,
      location,
    } = req.body;

    // Check if review exists
    const [testamonials] = await db.query(
      "SELECT * FROM testamonials WHERE id = ?",
      [id],
    );

    if (testamonials.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    // Handle image updates
    let imagesJson = testamonials[0].images_json;

    if (req.files && req.files.length > 0) {
      // Delete old images if they exist
      if (testamonials[0].images_json) {
        const oldImages = parseStoredPaths(testamonials[0].images_json);
        await removeFiles(oldImages);
      }

      const images = req.files.map((file) => file.path);
      imagesJson = JSON.stringify(images);
    }

    const updateQuery = `
      UPDATE testamonials 
      SET 
        author_name = COALESCE(?, author_name),
        author_email = COALESCE(?, author_email),
        rating = COALESCE(?, rating),
        category = COALESCE(?, category),
        title = COALESCE(?, title),
        review_text = COALESCE(?, review_text),
        images_json = COALESCE(?, images_json)
      WHERE id = ?
    `;

    await db.query(updateQuery, [
      author_name || null,
      author_email || null,
      rating || null,
      category || null,
      title || null,
      review_text || null,
      imagesJson,
      id,
    ]);

    // Fetch updated review
    const [updatedReview] = await db.query(
      "SELECT * FROM testamonials WHERE id = ?",
      [id],
    );

    res.json({
      success: true,
      message: "Review updated successfully",
      data: formatReviewForResponse(req, updatedReview[0]),
    });
  } catch (error) {
    console.error("Update Review Error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating review",
      error: error.message,
    });
  }
};

// Delete Review
exports.deleteReview = async (req, res) => {
  try {
    await ensuretestamonialsTableColumns();

    const { id } = req.params;

    const [testamonials] = await db.query(
      "SELECT * FROM testamonials WHERE id = ?",
      [id],
    );

    if (testamonials.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    // Delete associated images
    if (testamonials[0].images_json) {
      const imagePaths = parseStoredPaths(testamonials[0].images_json);
      await removeFiles(imagePaths);
    }

    await db.query("DELETE FROM testamonials WHERE id = ?", [id]);

    res.json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Delete Review Error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting review",
      error: error.message,
    });
  }
};
