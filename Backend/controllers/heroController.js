const db = require("../config/db");
const path = require("path");

const ensureHeroSchema = async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS hero_settings (
      id INT PRIMARY KEY,
      main_heading TEXT,
      images_json TEXT,
      mobile_images_json TEXT,
      call_us_link VARCHAR(255) DEFAULT '',
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  const columnsToAdd = [
    { name: "mobile_images_json", definition: "TEXT AFTER images_json" },
    { name: "call_us_link", definition: "VARCHAR(255) DEFAULT '' AFTER mobile_images_json" }
  ];

  for (const col of columnsToAdd) {
    const [cols] = await db.query("SHOW COLUMNS FROM hero_settings LIKE ?", [col.name]);
    if (!cols.length) {
      try {
        await db.query(`ALTER TABLE hero_settings ADD COLUMN ${col.name} ${col.definition}`);
      } catch (error) {
        console.warn(`Could not add column ${col.name}:`, error.message);
      }
    }
  }
};

const heroHasColumn = async (columnName) => {
  const [cols] = await db.query("SHOW COLUMNS FROM hero_settings LIKE ?", [columnName]);
  return cols.length > 0;
};

const formatHeroResponse = (req, row) => {
  const formatImages = (jsonStr) => {
    const images = JSON.parse(jsonStr || "[]");
    return images.map((img) => {
      if (img.startsWith("http")) return img;
      const cleanPath = img.replace(/^\/+/, "");
      return `${req.protocol}://${req.get("host")}/${cleanPath.replace(/\\/g, "/")}`;
    });
  };

  return {
    mainHeading: row.main_heading,
    backgroundImages: formatImages(row.images_json),
    mobileBackgroundImages: formatImages(row.mobile_images_json),
    callUsLink: row.call_us_link || "",
  };
};

exports.getHero = async (req, res) => {
  try {
    await ensureHeroSchema();
    const [rows] = await db.query("SELECT * FROM hero_settings WHERE id = 1");
    if (!rows.length) {
      return res.status(200).json({ 
        mainHeading: "Welcome", 
        backgroundImages: [], 
        mobileBackgroundImages: [], 
        callUsLink: "" 
      });
    }
    res.status(200).json(formatHeroResponse(req, rows[0]));
  } catch (error) {
    console.error("Hero get error:", error);
    res.status(500).json({ message: error.message, stack: error.stack });
  }
};

exports.updateHero = async (req, res) => {
  try {
    await ensureHeroSchema();

    const mainHeading = req.query.mainHeading || req.body.mainHeading;
    const callUsLink = req.query.callUsLink || req.body.callUsLink;
    const existing_images = req.query.existing_images || req.body.existing_images;
    const existing_mobile_images = req.query.existing_mobile_images || req.body.existing_mobile_images;
    const isMobileUpload = req.query.is_mobile_upload === "true" || req.body.is_mobile_upload === "true";

    const [rows] = await db.query("SELECT * FROM hero_settings WHERE id = 1");

    let currentImages = [];
    if (existing_images) {
      const rawArray = JSON.parse(existing_images);
      currentImages = rawArray.map((img) => {
        if (img.includes(req.get("host"))) {
          return img.split(`${req.get("host")}/`)[1];
        }
        return img;
      });
    } else if (rows.length) {
      currentImages = JSON.parse(rows[0].images_json || "[]");
    }

    let currentMobileImages = [];
    if (existing_mobile_images) {
      const rawMobileArray = JSON.parse(existing_mobile_images);
      currentMobileImages = rawMobileArray.map((img) => {
        if (img.includes(req.get("host"))) {
          return img.split(`${req.get("host")}/`)[1];
        }
        return img;
      });
    } else if (rows.length) {
      currentMobileImages = JSON.parse(rows[0].mobile_images_json || "[]");
    }

    if (req.file) {
      const relativePath = path
        .join("uploads", "hero", req.file.filename)
        .replace(/\\/g, "/");
      
      if (isMobileUpload) {
        currentMobileImages.push(relativePath);
      } else {
        currentImages.push(relativePath);
      }
    }

    const heading = mainHeading !== undefined ? mainHeading : (rows[0]?.main_heading || "");
    const callLink = callUsLink !== undefined ? callUsLink : (rows[0]?.call_us_link || "");

    const hasMobileCol = await heroHasColumn("mobile_images_json");
    const hasCallCol = await heroHasColumn("call_us_link");

    if (hasMobileCol && hasCallCol) {
      await db.query(
        `
          INSERT INTO hero_settings (id, main_heading, images_json, mobile_images_json, call_us_link) 
          VALUES (1, ?, ?, ?, ?) 
          ON DUPLICATE KEY UPDATE 
              main_heading = VALUES(main_heading), 
              images_json = VALUES(images_json),
              mobile_images_json = VALUES(mobile_images_json),
              call_us_link = VALUES(call_us_link)
        `,
        [heading, JSON.stringify(currentImages), JSON.stringify(currentMobileImages), callLink],
      );
    } else {
      await db.query(
        `
          INSERT INTO hero_settings (id, main_heading, images_json) 
          VALUES (1, ?, ?) 
          ON DUPLICATE KEY UPDATE 
              main_heading = VALUES(main_heading), 
              images_json = VALUES(images_json)
        `,
        [heading, JSON.stringify(currentImages)],
      );
    }

    res.status(200).json({ message: "Hero updated successfully" });
  } catch (error) {
    console.error("Hero update error:", error);
    res.status(500).json({ message: "Update failed", error: error.message, stack: error.stack });
  }
};