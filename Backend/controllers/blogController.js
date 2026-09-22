const db = require("../config/db");
const fs = require("fs/promises");
const path = require("path");

const BLOG_FIELD_TYPES = {
  title: "VARCHAR(255)",
  slug: "VARCHAR(255)",
  category: "VARCHAR(120)",
  excerpt: "TEXT",
  content: "LONGTEXT",
  image_path: "VARCHAR(500)",
  status: "VARCHAR(20)",
  is_featured: "TINYINT(1)",
  author_name: "VARCHAR(120)",
};

let blogSchemaSyncPromise;

const quoteIdentifier = (identifier) => `\`${identifier}\``;

const mapNullableString = (value) => {
  if (value === undefined || value === null) {
    return null;
  }

  const trimmed = String(value).trim();
  return trimmed === "" ? null : trimmed;
};

const slugify = (value) =>
  String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/(^-|-$)/g, "");

const normalizeStoredPath = (value) => {
  if (!value) {
    return null;
  }

  let normalized = String(value).trim().replace(/\\/g, "/");

  if (/^https?:\/\//i.test(normalized)) {
    try {
      normalized = new URL(normalized).pathname;
    } catch (_error) {
      // keep as-is
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

const formatBlogForResponse = (req, row) => {
  const image_path = normalizeStoredPath(row.image_path);

  return {
    ...row,
    image_path,
    image_url: toPublicFileUrl(req, image_path),
    is_featured: Boolean(row.is_featured),
  };
};

const removeFile = async (storedPath) => {
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
};

const ensureBlogsTableColumns = async () => {
  if (!blogSchemaSyncPromise) {
    blogSchemaSyncPromise = (async () => {
      await db.query(`
        CREATE TABLE IF NOT EXISTS blogs (
          id INT NOT NULL AUTO_INCREMENT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          PRIMARY KEY (id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      const [existing] = await db.query("SHOW COLUMNS FROM blogs");
      const existingColumns = new Set(existing.map((column) => column.Field));

      for (const [columnName, columnType] of Object.entries(BLOG_FIELD_TYPES)) {
        if (!existingColumns.has(columnName)) {
          await db.query(
            `ALTER TABLE blogs ADD COLUMN ${quoteIdentifier(columnName)} ${columnType} NULL`,
          );
        }
      }
    })().catch((error) => {
      blogSchemaSyncPromise = null;
      throw error;
    });
  }

  return blogSchemaSyncPromise;
};

const normalizePayload = (payload = {}) => {
  const title = mapNullableString(payload.title) || "";
  const category = mapNullableString(payload.category);
  const excerpt = mapNullableString(payload.excerpt);
  const content = mapNullableString(payload.content) || "";
  const status = mapNullableString(payload.status) || "draft";
  const author_name = mapNullableString(payload.author_name) || "Admin";
  const is_featured =
    payload.is_featured === true ||
    payload.is_featured === "true" ||
    payload.is_featured === 1 ||
    payload.is_featured === "1"
      ? 1
      : 0;
  const providedSlug = mapNullableString(payload.slug);
  const slug = slugify(providedSlug || title);

  return {
    title,
    slug,
    category,
    excerpt,
    content,
    image_path: null,
    status: status === "published" ? "published" : "draft",
    is_featured,
    author_name,
  };
};

const validatePayload = ({ title, content, slug }) => {
  if (!title) {
    return "title is required";
  }

  if (!content) {
    return "content is required";
  }

  if (!slug) {
    return "slug could not be generated";
  }

  return null;
};

exports.createBlog = async (req, res) => {
  try {
    await ensureBlogsTableColumns();

    const payload = normalizePayload(req.body);
    payload.image_path = normalizeStoredPath(req.file?.path);

    const validationError = validatePayload(payload);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const columns = Object.keys(payload);
    const placeholders = columns.map(() => "?").join(", ");
    const query = `INSERT INTO blogs (${columns
      .map((column) => quoteIdentifier(column))
      .join(", ")}) VALUES (${placeholders})`;

    const [result] = await db.query(
      query,
      columns.map((column) => payload[column]),
    );

    const [rows] = await db.query("SELECT * FROM blogs WHERE id = ?", [
      result.insertId,
    ]);

    return res.status(201).json({
      message: "Blog created successfully",
      blog: formatBlogForResponse(req, rows[0]),
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to create blog", error: error.message });
  }
};

exports.getAllBlogs = async (req, res) => {
  try {
    await ensureBlogsTableColumns();

    const { page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const offset = (pageNum - 1) * limitNum;

    const where = [];
    const values = [];

    if (req.query.status === "published" || req.query.status === "draft") {
      where.push("status = ?");
      values.push(req.query.status);
    }

    if (req.query.category) {
      where.push("category = ?");
      values.push(req.query.category);
    }

    const whereClause = where.length ? `WHERE ${where.join(" AND ")}` : "";
    
    // Get total count
    const [countResult] = await db.query(
      `SELECT COUNT(*) as total FROM blogs ${whereClause}`,
      values,
    );
    const total = countResult[0].total;

    // Get paginated results
    const [rows] = await db.query(
      `SELECT * FROM blogs ${whereClause} ORDER BY id DESC LIMIT ? OFFSET ?`,
      [...values, limitNum, offset],
    );

    return res.status(200).json({
      success: true,
      data: rows.map((row) => formatBlogForResponse(req, row)),
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching blogs", error: error.message });
  }
};

exports.getBlogById = async (req, res) => {
  try {
    await ensureBlogsTableColumns();

    const blogId = Number(req.params.id);
    if (!blogId) {
      return res.status(400).json({ message: "Invalid blog id" });
    }

    const [rows] = await db.query("SELECT * FROM blogs WHERE id = ?", [blogId]);

    if (!rows.length) {
      return res.status(404).json({ message: "Blog not found" });
    }

    return res.status(200).json(formatBlogForResponse(req, rows[0]));
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching blog", error: error.message });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    await ensureBlogsTableColumns();

    const blogId = Number(req.params.id);
    if (!blogId) {
      return res.status(400).json({ message: "Invalid blog id" });
    }

    const [existingRows] = await db.query("SELECT * FROM blogs WHERE id = ?", [
      blogId,
    ]);

    if (!existingRows.length) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const previousBlog = existingRows[0];

    const payload = normalizePayload(req.body);
    const previousImagePath = normalizeStoredPath(previousBlog.image_path);
    const existingImagePath = normalizeStoredPath(req.body.existing_image_path);
    const uploadedImagePath = normalizeStoredPath(req.file?.path);

    payload.image_path = uploadedImagePath || existingImagePath || null;

    const validationError = validatePayload(payload);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const columns = Object.keys(payload);
    const setClause = columns
      .map((column) => `${quoteIdentifier(column)} = ?`)
      .join(", ");

    const values = columns.map((column) => payload[column]);
    await db.query(`UPDATE blogs SET ${setClause} WHERE id = ?`, [
      ...values,
      blogId,
    ]);

    if (previousImagePath && previousImagePath !== payload.image_path) {
      await removeFile(previousImagePath);
    }

    const [rows] = await db.query("SELECT * FROM blogs WHERE id = ?", [blogId]);

    return res.status(200).json({
      message: "Blog updated successfully",
      blog: formatBlogForResponse(req, rows[0]),
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to update blog", error: error.message });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    await ensureBlogsTableColumns();

    const blogId = Number(req.params.id);
    if (!blogId) {
      return res.status(400).json({ message: "Invalid blog id" });
    }

    const [existingRows] = await db.query("SELECT * FROM blogs WHERE id = ?", [
      blogId,
    ]);

    if (!existingRows.length) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const previousBlog = existingRows[0];
    const previousImagePath = normalizeStoredPath(previousBlog.image_path);

    await db.query("DELETE FROM blogs WHERE id = ?", [blogId]);

    if (previousImagePath) {
      await removeFile(previousImagePath);
    }

    return res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to delete blog", error: error.message });
  }
};

exports.getCategories = async (req, res) => {
  try {
    await ensureBlogsTableColumns();

    const [rows] = await db.query(`
      SELECT category as title, COUNT(*) as count
      FROM blogs
      WHERE category IS NOT NULL AND category != ''
      GROUP BY category
      ORDER BY count DESC
    `);

    return res.status(200).json({
      categories: rows || []
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching categories", error: error.message });
  }
};
