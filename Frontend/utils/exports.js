export const apiURL = process.env.NEXT_PUBLIC_API_URL || "https://apis.ukaautotrade.co.uk/api";
export const backendURL = process.env.NEXT_PUBLIC_API_URL || "https://apis.ukaautotrade.co.uk/api";
export const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "https://apis.ukaautotrade.co.uk";

export const getImageUrl = (imagePath, fallback = "/assets/images/car-list/car1.jpg") => {
  if (!imagePath) return fallback;
  if (typeof imagePath !== "string") return fallback;
  
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  
  if (imagePath.startsWith("/uploads") || imagePath.startsWith("uploads")) {
    const cleanPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
    return `${baseURL}${cleanPath}`;
  }
  
  if (imagePath.startsWith("/")) {
    return imagePath;
  }
  
  return `${baseURL}/${imagePath}`;
};

/**
 * Check if a car item is registered (has a valid non-empty trimmed plate number).
 */
export const isRegisteredCar = (car) => {
  if (!car) return false;
  const plate = car.plate_number ?? car.plateNo ?? car.plate;
  if (plate === null || plate === undefined) return false;
  return String(plate).trim().length > 0;
};

/**
 * Sort cars with registration priority:
 * 1. Registered cars first (valid non-empty plateNo)
 * 2. Unregistered cars second (missing/null/empty/whitespace plateNo)
 * 3. Within each group: status order (in_stock=1, in_transit=2, on_order=3) then newest created_at DESC
 */
export const sortCarsWithRegistrationPriority = (cars = []) => {
  return [...cars].sort((a, b) => {
    // 1. Registration priority (Registered = 0, Unregistered = 1)
    const aReg = isRegisteredCar(a) ? 0 : 1;
    const bReg = isRegisteredCar(b) ? 0 : 1;
    if (aReg !== bReg) {
      return aReg - bReg;
    }

    // 2. Status priority
    const priority = { in_stock: 1, in_transit: 2, on_order: 3 };
    const aPriority = priority[a.status] || 99;
    const bPriority = priority[b.status] || 99;
    if (aPriority !== bPriority) {
      return aPriority - bPriority;
    }

    // 3. Newest first (created_at DESC)
    const aTime = a.created_at ? new Date(a.created_at).getTime() : 0;
    const bTime = b.created_at ? new Date(b.created_at).getTime() : 0;
    return bTime - aTime;
  });
};

/**
 * Normalizes a Body Type string:
 * - "Station Wagon" / "Station wagon" -> "Estate"
 * - "Coupe" / "Convertible" -> null (excluded)
 * - Returns normalized string or original if allowed
 */
export const normalizeBodyType = (type) => {
  if (!type) return null;
  const trimmed = String(type).trim();
  if (/^station\s*wagon$/i.test(trimmed)) return "Estate";
  if (/^coupe$/i.test(trimmed) || /^convertible$/i.test(trimmed)) return null;
  return trimmed;
};

/**
 * Filter and sort Body Types list A-Z:
 * - Removes Coupe and Convertible
 * - Maps Station Wagon -> Estate
 * - Removes duplicates
 * - Sorts alphabetically A-Z
 */
export const filterAndSortBodyTypes = (typesList = []) => {
  const mapped = typesList
    .map((t) => normalizeBodyType(t))
    .filter(Boolean);
  return Array.from(new Set(mapped)).sort((a, b) => a.localeCompare(b));
};

export const ALLOWED_BODY_TYPES = [
  "Crossover",
  "Estate",
  "Hatchback",
  "Sedan",
  "SUV",
  "Van",
];

export { kmToMiles, milesToKm, formatMileage } from "./mileage";

/**
 * Strips HTML tags and unescapes HTML entities to return clean text.
 */
export const stripHtml = (html) => {
  if (!html) return "";
  return String(html)
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
};

/**
 * Extracts and cleans description/excerpt/content from a blog object.
 */
export const getBlogDesc = (item) => {
  if (!item) return "";
  const raw = item.excerpt || item.content || item.description || item.desc || "";
  return stripHtml(raw);
};




