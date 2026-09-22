const db = require("../config/db");
const fs = require("fs/promises");
const path = require("path");

const LISTING_FIELD_TYPES = {
  listing_title: { type: "VARCHAR(255)", unique: false },
  model: { type: "VARCHAR(255)", unique: false },
  brand: { type: "VARCHAR(255)", unique: false },
  units: { type: "VARCHAR(255)", unique: false },
  type: { type: "VARCHAR(255)", unique: false },
  years: { type: "VARCHAR(50)", unique: false },
  condition: { type: "VARCHAR(255)", unique: false },
  mileage: { type: "VARCHAR(100)", unique: false },
  transmission: { type: "VARCHAR(100)", unique: false },
  engine_size: { type: "VARCHAR(100)", unique: false },
  cylinders: { type: "VARCHAR(100)", unique: false },
  fuel_type: { type: "VARCHAR(100)", unique: false },
  doors: { type: "VARCHAR(50)", unique: false },
  // color: { type: "VARCHAR(100)", unique: false },
  exterior_color: { type: "VARCHAR(100)", unique: false },
  interior_color: { type: "VARCHAR(100)", unique: false },
  vin_number: { type: "VARCHAR(50)", unique: true },
  seats: { type: "VARCHAR(50)", unique: false },
  description: { type: "TEXT", unique: false },
  price: { type: "DECIMAL(12,2)", unique: false },
  city_mpg: { type: "VARCHAR(50)", unique: false },
  highway_mpg: { type: "VARCHAR(50)", unique: false },
  drive_type: { type: "VARCHAR(50)", unique: false },
  plate_number: { type: "VARCHAR(20)", unique: true },
  road_tax: { type: "VARCHAR(100)", unique: false },
  location: { type: "VARCHAR(255)", unique: false },
  full_address: { type: "VARCHAR(255)", unique: false },
  map_location: { type: "VARCHAR(255)", unique: false },
  video_url: { type: "VARCHAR(255)", unique: false },
  images_json: { type: "LONGTEXT", unique: false },
  attachments_json: { type: "LONGTEXT", unique: false },
  is_sold: { type: "BOOLEAN", unique: false },
  status: { type: "ENUM('in_stock', 'in_transit', 'on_order')", unique: false },
};

let listingSchemaSyncPromise;

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

const parseFeatureIds = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value
      .map((item) => Number(item))
      .filter((id) => !Number.isNaN(id));
  }
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed
          .map((item) => Number(item))
          .filter((id) => !Number.isNaN(id));
      }
    } catch (_error) {
      return value
        .split(",")
        .map((item) => Number(item.trim()))
        .filter((id) => !Number.isNaN(id));
    }
  }
  return [];
};

const parseFeatureNames = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item).trim())
      .filter((item) => item.length > 0);
  }
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed
          .map((item) => String(item).trim())
          .filter((item) => item.length > 0);
      }
    } catch (_error) {
      return value
        .split(",")
        .map((item) => String(item).trim())
        .filter((item) => item.length > 0);
    }
  }
  return [];
};

const getOrCreateFeatureIds = async (featureNames) => {
  const names = Array.from(
    new Set(
      featureNames
        .map((name) => String(name).trim())
        .filter((name) => name.length > 0),
    ),
  );

  if (!names.length) {
    return [];
  }

  const [existingRows] = await db.query(
    `SELECT id, name FROM features WHERE name IN (?)`,
    [names],
  );
  const existingMap = new Map(existingRows.map((row) => [row.name, row.id]));

  const missingNames = names.filter((name) => !existingMap.has(name));
  if (missingNames.length) {
    const values = missingNames.map((name) => [name]);
    await db.query("INSERT INTO features (name) VALUES ?", [values]);

    const [newRows] = await db.query(
      `SELECT id, name FROM features WHERE name IN (?)`,
      [missingNames],
    );
    newRows.forEach((row) => {
      existingMap.set(row.name, row.id);
    });
  }

  return names
    .map((name) => existingMap.get(name))
    .filter((id) => Boolean(id));
};

const saveListingFeatures = async (listingId, featureIds) => {
  await db.query("DELETE FROM listing_features WHERE listing_id = ?", [
    listingId,
  ]);
  if (!featureIds.length) return;

  const values = featureIds.map((featureId) => [listingId, featureId]);
  await db.query(
    "INSERT INTO listing_features (listing_id, feature_id) VALUES ?",
    [values],
  );
};

const loadListingFeatures = async (listingId) => {
  const [rows] = await db.query(
    `SELECT f.name FROM features f
     JOIN listing_features lf ON f.id = lf.feature_id
     WHERE lf.listing_id = ?`,
    [listingId],
  );
  return rows.map((row) => row.name);
};

const loadFeaturesForListings = async (listingIds) => {
  if (!listingIds.length) return {};

  const [rows] = await db.query(
    `SELECT lf.listing_id, f.name FROM listing_features lf
     JOIN features f ON f.id = lf.feature_id
     WHERE lf.listing_id IN (?)`,
    [listingIds],
  );

  return rows.reduce((map, row) => {
    if (!map[row.listing_id]) map[row.listing_id] = [];
    map[row.listing_id].push(row.name);
    return map;
  }, {});
};

const formatListingForResponse = (req, row) => {
  const image_paths = parseStoredPaths(row.images_json);
  const attachment_paths = parseStoredPaths(row.attachments_json);

  const locVal = row.location || row.full_address || null;
  const plateVal = row.plate_number && String(row.plate_number).trim() ? String(row.plate_number).trim() : null;
  const rawType = row.type ? String(row.type).trim() : null;
  const typeVal = rawType && /^station\s*wagon$/i.test(rawType) ? "Estate" : rawType;

  return {
    ...row,
    type: typeVal,
    location: locVal,
    full_address: locVal,
    plate_number: plateVal,
    plateNo: plateVal,
    images_json: image_paths.length ? JSON.stringify(image_paths) : null,
    attachments_json: attachment_paths.length
      ? JSON.stringify(attachment_paths)
      : null,
    images: image_paths.map((storedPath) => toPublicFileUrl(req, storedPath)),
    attachments: attachment_paths.map((storedPath) =>
      toPublicFileUrl(req, storedPath),
    ),
    image_paths,
    attachment_paths,
    features: row.features || [],
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

const ensureListingsTableColumns = async () => {
  if (!listingSchemaSyncPromise) {
    listingSchemaSyncPromise = (async () => {
      await db.query(`
        CREATE TABLE IF NOT EXISTS listings (
          id INT NOT NULL AUTO_INCREMENT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          PRIMARY KEY (id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      const [existing] = await db.query("SHOW COLUMNS FROM listings");
      const existingColumns = new Map(
        existing.map((column) => [column.Field, column]),
      );
      const [indexes] = await db.query("SHOW INDEX FROM listings");

      const hasUniqueIndex = (columnName) =>
        indexes.some(
          (index) =>
            index.Column_name === columnName && Number(index.Non_unique) === 0,
        );

      for (const [columnName, columnType] of Object.entries(
        LISTING_FIELD_TYPES,
      )) {
        if (!existingColumns.has(columnName)) {
          await db.query(
            `ALTER TABLE listings ADD COLUMN ${quoteIdentifier(columnName)} ${columnType.type} ${columnType.unique ? 'UNIQUE' : ''} NULL`,
          );
        } else if (columnType.unique && !hasUniqueIndex(columnName)) {
          const indexName = `idx_listings_${columnName}_unique`;
          await db.query(
            `ALTER TABLE listings ADD UNIQUE INDEX ${quoteIdentifier(indexName)} (${quoteIdentifier(columnName)})`,
          );
        } else if (!columnType.unique && hasUniqueIndex(columnName)) {
          const uniqueIndexes = indexes.filter(
            (index) =>
              index.Column_name === columnName && Number(index.Non_unique) === 0,
          );
          for (const idx of uniqueIndexes) {
            await db.query(
              `ALTER TABLE listings DROP INDEX ${quoteIdentifier(idx.Key_name)}`,
            );
          }
        }
      }
    })().catch((error) => {
      listingSchemaSyncPromise = null;
      throw error;
    });
  }

  return listingSchemaSyncPromise;
};

const mapNullableString = (value) => {
  if (value === undefined || value === null) {
    return null;
  }

  const trimmed = String(value).trim();
  return trimmed === "" ? null : trimmed;
};

const normalizePayload = (payload = {}) => {
  const listing_title = mapNullableString(payload.listing_title) || "";
  const model = mapNullableString(payload.model) || "";
  const brand = mapNullableString(payload.brand) || "";
  const units = mapNullableString(payload.units) || "";
  let type = mapNullableString(payload.type);
  if (type && /^station\s*wagon$/i.test(type)) {
    type = "Estate";
  }
  const years = mapNullableString(payload.years);
  const condition = mapNullableString(payload.condition);
  const mileage = mapNullableString(payload.mileage);
  const transmission = mapNullableString(payload.transmission);
  const engine_size = mapNullableString(payload.engine_size);
  const cylinders = mapNullableString(payload.cylinders);
  const fuel_type = mapNullableString(payload.fuel_type);
  const doors = mapNullableString(payload.doors);
  // const color = mapNullableString(payload.color);
  const exterior_color = mapNullableString(payload.exterior_color);
  const interior_color = mapNullableString(payload.interior_color);
  const vin_number = mapNullableString(payload.vin_number);
  const seats = mapNullableString(payload.seats);
  const description = mapNullableString(payload.description);
  const rawPrice = payload.price;
  const price =
    rawPrice === "" || rawPrice === null || rawPrice === undefined
      ? null
      : Number(rawPrice);
  const city_mpg = mapNullableString(payload.city_mpg) || "";
  const highway_mpg = mapNullableString(payload.highway_mpg) || "";
  const drive_type = mapNullableString(payload.drive_type) || "";
  const plate_number = mapNullableString(payload.plate_number);
  const road_tax = mapNullableString(payload.road_tax);
  const locationRaw = mapNullableString(payload.location);
  const fullAddressRaw = mapNullableString(payload.full_address);
  const location = locationRaw || fullAddressRaw;
  const full_address = fullAddressRaw || locationRaw;
  const map_location = mapNullableString(payload.map_location);
  const video_url = mapNullableString(payload.video_url);
  const status = mapNullableString(payload.status) || "in_stock";

  return {
    listing_title,
    model,
    brand,
    units,
    type,
    years,
    condition,
    mileage,
    transmission,
    engine_size,
    cylinders,
    fuel_type,
    doors,
    // color,
    exterior_color,
    interior_color,
    vin_number,
    seats,
    description,
    price,
    city_mpg,
    highway_mpg,
    drive_type,
    plate_number,
    road_tax,
    location,
    full_address,
    map_location,
    video_url,
    status,
    images_json: null,
    attachments_json: null,
  };
};

const validatePayload = ({ listing_title, model, brand, price, status = "in_stock" }) => {
  if (!listing_title || !model || !brand) {
    return "listing_title, model and brand are required";
  }

  // Price is required for in_stock status, optional for in_transit and on_order
  if (status === "in_stock" && !price) {
    return "price is required for in_stock listings";
  }

  if (price !== null && Number.isNaN(price)) {
    return "price must be a valid number";
  }

  return null;
};

exports.createListing = async (req, res) => {
  try {
    await ensureListingsTableColumns();

    const payload = normalizePayload(req.body);

    console.log("Creating listing with title:", payload.listing_title);
    console.log("Files received:", {
      images: req.files?.images?.length || 0,
      attachments: req.files?.attachments?.length || 0,
    });

    const uploadedImages = (req.files?.images || []).map((file) =>
      normalizeStoredPath(file.path),
    );
    const uploadedAttachments = (req.files?.attachments || []).map((file) =>
      normalizeStoredPath(file.path),
    );

    payload.images_json = JSON.stringify(uploadedImages);
    payload.attachments_json = JSON.stringify(uploadedAttachments);

    const featureNames = parseFeatureNames(req.body.features);
    const featureIds = await getOrCreateFeatureIds(featureNames);

    if (payload.plate_number) {
      const [existing] = await db.query("SELECT id FROM listings WHERE plate_number = ?", [payload.plate_number]);
      if (existing.length > 0) {
        return res.status(400).json({ message: "Plate number already exists" });
      }
    }


    const validationError = validatePayload(payload);

    if (validationError) {
      console.error("Validation error:", validationError);
      return res.status(400).json({ message: validationError });
    }

    // Validate status enum
    const validStatuses = ["in_stock", "in_transit", "on_order"];
    if (payload.status && !validStatuses.includes(payload.status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const columns = Object.keys(payload);
    const quotedColumns = columns.map((column) => quoteIdentifier(column));
    const placeholders = columns.map(() => "?").join(", ");
    const query = `INSERT INTO listings (${quotedColumns.join(", ")}) VALUES (${placeholders})`;
    const [result] = await db.query(
      query,
      columns.map((column) => payload[column]),
    );

    console.log("Listing inserted with ID:", result.insertId);

    await saveListingFeatures(result.insertId, featureIds);

    const [rows] = await db.query("SELECT * FROM listings WHERE id = ?", [
      result.insertId,
    ]);

    const createdListing = formatListingForResponse(req, rows[0]);
    createdListing.features = await loadListingFeatures(result.insertId);

    return res.status(201).json({
      message: "Listing created successfully",
      listing: createdListing,
    });
  } catch (error) {
    console.error("Error creating listing:", error);
    return res
      .status(500)
      .json({ message: "Failed to create listing", error: error.message });
  }
};

exports.getListingLocations = async (req, res) => {
  try {
    await ensureListingsTableColumns();

    const [rows] = await db.query(
      `SELECT DISTINCT full_address, location FROM listings 
       WHERE (is_sold = FALSE OR is_sold IS NULL) 
         AND ((full_address IS NOT NULL AND TRIM(full_address) != '') OR (location IS NOT NULL AND TRIM(location) != ''))`,
    );

    const locations = Array.from(
      new Set(
        rows
          .map((r) => {
            const loc = r.location || r.full_address;
            return loc && String(loc).trim();
          })
          .filter(Boolean),
      ),
    ).sort();

    return res.status(200).json(locations);
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching listing locations",
      error: error.message,
    });
  }
};

exports.getAllListings = async (req, res) => {
  try {
    await ensureListingsTableColumns();

    let {
      type,
      vin_number,
      search,
      q,
      makes,
      brand,
      model,
      fuel_type,
      transmission,
      units,
      exterior_color,
      location,
      locations,
      minPrice,
      maxPrice,
      minEngine,
      maxEngine,
      minKm,
      maxKm,
      minYear,
      maxYear,
      sort,
    } = req.query;

    // Backend Validation
    if (maxPrice !== undefined && maxPrice !== null && maxPrice !== "") {
      const parsedMaxPrice = Number(maxPrice);
      if (!Number.isNaN(parsedMaxPrice) && parsedMaxPrice > 30000) {
        return res.status(400).json({ message: "Price maximum cannot exceed £30,000" });
      }
    }

    if (maxEngine !== undefined && maxEngine !== null && maxEngine !== "") {
      const parsedMaxEngine = Number(maxEngine);
      if (!Number.isNaN(parsedMaxEngine) && parsedMaxEngine > 5000) {
        return res.status(400).json({ message: "Engine size maximum cannot exceed 5000 cc" });
      }
    }

    let query = "SELECT * FROM listings WHERE (is_sold = FALSE OR is_sold IS NULL)";
    let values = [];

    // Multi-select Makes (OR logic within makes)
    const selectedMakesRaw = makes || brand;
    if (selectedMakesRaw) {
      let makesList = [];
      if (Array.isArray(selectedMakesRaw)) {
        makesList = selectedMakesRaw.filter((m) => m && m !== "Any Make" && m !== "All Makes");
      } else if (typeof selectedMakesRaw === "string") {
        makesList = selectedMakesRaw
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s && s !== "Any Make" && s !== "All Makes");
      }
      if (makesList.length > 0) {
        query += " AND brand IN (?)";
        values.push(makesList);
      }
    }

    // Location Filter (full_address in DB)
    const selectedLocationsRaw = locations || location;
    if (selectedLocationsRaw) {
      let locList = [];
      if (Array.isArray(selectedLocationsRaw)) {
        locList = selectedLocationsRaw.filter((l) => l && l !== "Any Location" && l !== "All Locations");
      } else if (typeof selectedLocationsRaw === "string") {
        locList = selectedLocationsRaw
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s && s !== "Any Location" && s !== "All Locations");
      }
      if (locList.length > 0) {
        query += " AND (full_address IN (?) OR location IN (?))";
        values.push(locList, locList);
      }
    }

    // Body / Type filter
    if (type && type !== "Any Body") {
      if (type === "Estate" || /^station\s*wagon$/i.test(type)) {
        query += " AND (type = 'Estate' OR type = 'Station Wagon' OR type = 'Station wagon')";
      } else {
        query += " AND type = ?";
        values.push(type);
      }
    }

    // Model filter
    if (model && model !== "Any Model") {
      query += " AND model = ?";
      values.push(model);
    }

    // Fuel Type filter
    if (fuel_type && fuel_type !== "Any Fuel") {
      query += " AND fuel_type = ?";
      values.push(fuel_type);
    }

    // Transmission filter
    if (transmission && transmission !== "Any Transmission") {
      query += " AND transmission = ?";
      values.push(transmission);
    }

    // Units filter
    if (units && units !== "Any Units") {
      query += " AND units = ?";
      values.push(units);
    }

    // Exterior color filter
    if (exterior_color && exterior_color !== "Any Color") {
      query += " AND exterior_color = ?";
      values.push(exterior_color);
    }

    // Price range filters
    if (minPrice !== undefined && minPrice !== null && minPrice !== "") {
      const parsedMin = Number(minPrice);
      if (!Number.isNaN(parsedMin)) {
        query += " AND price >= ?";
        values.push(parsedMin);
      }
    }
    if (maxPrice !== undefined && maxPrice !== null && maxPrice !== "") {
      const parsedMax = Number(maxPrice);
      if (!Number.isNaN(parsedMax)) {
        query += " AND price <= ?";
        values.push(parsedMax);
      }
    }

    // Engine size range filters
    if (minEngine !== undefined && minEngine !== null && minEngine !== "") {
      const parsedMin = Number(minEngine);
      if (!Number.isNaN(parsedMin)) {
        query += " AND CAST(NULLIF(REGEXP_REPLACE(engine_size, '[^0-9]', ''), '') AS UNSIGNED) >= ?";
        values.push(parsedMin);
      }
    }
    if (maxEngine !== undefined && maxEngine !== null && maxEngine !== "") {
      const parsedMax = Number(maxEngine);
      if (!Number.isNaN(parsedMax)) {
        query += " AND CAST(NULLIF(REGEXP_REPLACE(engine_size, '[^0-9]', ''), '') AS UNSIGNED) <= ?";
        values.push(parsedMax);
      }
    }

    // Mileage / KM range filters
    if (minKm !== undefined && minKm !== null && minKm !== "") {
      const parsedMin = Number(minKm);
      if (!Number.isNaN(parsedMin)) {
        query += " AND CAST(NULLIF(REGEXP_REPLACE(mileage, '[^0-9]', ''), '') AS UNSIGNED) >= ?";
        values.push(parsedMin);
      }
    }
    if (maxKm !== undefined && maxKm !== null && maxKm !== "") {
      const parsedMax = Number(maxKm);
      if (!Number.isNaN(parsedMax)) {
        query += " AND CAST(NULLIF(REGEXP_REPLACE(mileage, '[^0-9]', ''), '') AS UNSIGNED) <= ?";
        values.push(parsedMax);
      }
    }

    // Year range filters
    if (minYear !== undefined && minYear !== null && minYear !== "") {
      const parsedMin = Number(minYear);
      if (!Number.isNaN(parsedMin)) {
        query += " AND CAST(NULLIF(REGEXP_REPLACE(years, '[^0-9]', ''), '') AS UNSIGNED) >= ?";
        values.push(parsedMin);
      }
    }
    if (maxYear !== undefined && maxYear !== null && maxYear !== "") {
      const parsedMax = Number(maxYear);
      if (!Number.isNaN(parsedMax)) {
        query += " AND CAST(NULLIF(REGEXP_REPLACE(years, '[^0-9]', ''), '') AS UNSIGNED) <= ?";
        values.push(parsedMax);
      }
    }

    // Search term matching title, brand, model, plate, VIN
    const searchTerm = search || vin_number || q;
    if (searchTerm && String(searchTerm).trim().length > 0) {
      const trimmed = String(searchTerm).trim().toLowerCase();
      const termNoSpace = `%${trimmed.replace(/\s+/g, "")}%`;
      const termLike = `%${trimmed}%`;

      query += ` AND (
        LOWER(listing_title) LIKE ? OR
        LOWER(brand) LIKE ? OR
        LOWER(model) LIKE ? OR
        LOWER(type) LIKE ? OR
        REPLACE(LOWER(plate_number), ' ', '') LIKE ? OR
        REPLACE(LOWER(vin_number), ' ', '') LIKE ?
      )`;
      values.push(termLike, termLike, termLike, termLike, termNoSpace, termNoSpace);
    }

    // Sorting
    if (sort === "Lowest Price") {
      query += " ORDER BY price ASC";
    } else if (sort === "Highest Price") {
      query += " ORDER BY price DESC";
    } else if (sort === "Low Mileage") {
      query += " ORDER BY CAST(NULLIF(REGEXP_REPLACE(mileage, '[^0-9]', ''), '') AS UNSIGNED) ASC";
    } else if (sort === "High Mileage") {
      query += " ORDER BY CAST(NULLIF(REGEXP_REPLACE(mileage, '[^0-9]', ''), '') AS UNSIGNED) DESC";
    } else if (sort === "Low Engine") {
      query += " ORDER BY CAST(NULLIF(REGEXP_REPLACE(engine_size, '[^0-9]', ''), '') AS UNSIGNED) ASC";
    } else if (sort === "High Engine") {
      query += " ORDER BY CAST(NULLIF(REGEXP_REPLACE(engine_size, '[^0-9]', ''), '') AS UNSIGNED) DESC";
    } else if (sort === "Newest First") {
      query += " ORDER BY CAST(NULLIF(REGEXP_REPLACE(years, '[^0-9]', ''), '') AS UNSIGNED) DESC";
    } else if (sort === "Oldest First") {
      query += " ORDER BY CAST(NULLIF(REGEXP_REPLACE(years, '[^0-9]', ''), '') AS UNSIGNED) ASC";
    } else {
      query += ` ORDER BY 
        CASE 
          WHEN (plate_number IS NOT NULL AND TRIM(plate_number) != '') THEN 0 
          ELSE 1 
        END ASC,
        CASE 
          WHEN status = 'in_stock' THEN 0
          WHEN status = 'in_transit' THEN 1
          WHEN status = 'on_order' THEN 2
          ELSE 3
        END ASC,
        created_at DESC`;
    }

    const [listings] = await db.query(query, values);
    const featuresMap = await loadFeaturesForListings(listings.map((listing) => listing.id));

    return res.status(200).json(
      listings.map((listing) => {
        const formatted = formatListingForResponse(req, listing);
        formatted.features = featuresMap[listing.id] || [];
        return formatted;
      }),
    );
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching listings",
      error: error.message,
    });
  }
};

exports.getListingById = async (req, res) => {
  try {
    await ensureListingsTableColumns();

    const listingId = Number(req.params.id);

    if (!listingId) {
      return res.status(400).json({ message: "Invalid listing id" });
    }

    const [rows] = await db.query("SELECT * FROM listings WHERE id = ?", [
      listingId,
    ]);

    if (!rows.length) {
      return res.status(404).json({ message: "Listing not found" });
    }

    const listing = formatListingForResponse(req, rows[0]);
    listing.features = await loadListingFeatures(listingId);

    return res.status(200).json(listing);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching listing", error: error.message });
  }
};

exports.updateListing = async (req, res) => {
  try {
    await ensureListingsTableColumns();

    const listingId = Number(req.params.id);

    if (!listingId) {
      return res.status(400).json({ message: "Invalid listing id" });
    }

    const [existingRows] = await db.query(
      "SELECT * FROM listings WHERE id = ?",
      [listingId],
    );

    if (!existingRows.length) {
      return res.status(404).json({ message: "Listing not found" });
    }

    const previousListing = existingRows[0];
    const previousImages = parseStoredPaths(previousListing.images_json);
    const previousAttachments = parseStoredPaths(
      previousListing.attachments_json,
    );

    const existingImages = parseStoredPaths(req.body.existing_images);
    const existingAttachments = parseStoredPaths(req.body.existing_attachments);
    const uploadedImages = (req.files?.images || []).map((file) =>
      normalizeStoredPath(file.path),
    );
    const uploadedAttachments = (req.files?.attachments || []).map((file) =>
      normalizeStoredPath(file.path),
    );

    const payload = normalizePayload(req.body);
    const featureNames = parseFeatureNames(req.body.features);
    const featureIds = await getOrCreateFeatureIds(featureNames);

    if (payload.plate_number) {
      const [existing] = await db.query("SELECT id FROM listings WHERE plate_number = ? AND id != ?", [payload.plate_number, listingId]);
      if (existing.length > 0) {
        return res.status(400).json({ message: "Plate number already exists" });
      }
    }


    const nextImages = [...existingImages, ...uploadedImages].slice(0, 30);
    const nextAttachments = [
      ...existingAttachments,
      ...uploadedAttachments,
    ].slice(0, 30);

    payload.images_json = JSON.stringify(nextImages);
    payload.attachments_json = JSON.stringify(nextAttachments);

    const validationError = validatePayload(payload);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    // Validate status enum
    const validStatuses = ["in_stock", "in_transit", "on_order"];
    if (payload.status && !validStatuses.includes(payload.status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const columns = Object.keys(payload);
    const setClause = columns
      .map((column) => `${quoteIdentifier(column)} = ?`)
      .join(", ");
    const updateQuery = `UPDATE listings SET ${setClause} WHERE id = ?`;
    const values = columns.map((column) => payload[column]);
    const [result] = await db.query(updateQuery, [...values, listingId]);

    await saveListingFeatures(listingId, featureIds);

    const [rows] = await db.query("SELECT * FROM listings WHERE id = ?", [
      listingId,
    ]);

    const removedImages = previousImages.filter(
      (storedPath) => !nextImages.includes(storedPath),
    );
    const removedAttachments = previousAttachments.filter(
      (storedPath) => !nextAttachments.includes(storedPath),
    );

    await removeFiles([...removedImages, ...removedAttachments]);

    const updatedListing = formatListingForResponse(req, rows[0]);
    updatedListing.features = await loadListingFeatures(listingId);

    return res.status(200).json({
      message: "Listing updated successfully",
      listing: updatedListing,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to update listing", error: error.message });
  }
};

exports.deleteListing = async (req, res) => {
  try {
    await ensureListingsTableColumns();

    const listingId = Number(req.params.id);

    if (!listingId) {
      return res.status(400).json({ message: "Invalid listing id" });
    }

    const [existingRows] = await db.query(
      "SELECT * FROM listings WHERE id = ?",
      [listingId],
    );

    if (!existingRows.length) {
      return res.status(404).json({ message: "Listing not found" });
    }

    const previousListing = existingRows[0];
    const previousImages = parseStoredPaths(previousListing.images_json);
    const previousAttachments = parseStoredPaths(
      previousListing.attachments_json,
    );

    const [result] = await db.query("DELETE FROM listings WHERE id = ?", [
      listingId,
    ]);

    if (result.affectedRows) {
      await removeFiles([...previousImages, ...previousAttachments]);
    }

    return res.status(200).json({ message: "Listing deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to delete listing", error: error.message });
  }
};
