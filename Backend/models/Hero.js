/**
 * Hero Model
 * Defines the structure of the Hero Section.
 */
class Hero {
  constructor(data) {
    this.id = 1; // Singleton: only one hero section exists
    this.main_heading =
      data.main_heading || "Turn Your Car Dreams Into Reality";
    this.images_json = data.images_json || "[]"; // Stored as stringified array
    this.call_us_link = data.call_us_link || ""; // Call us button link
  }

  /**
   * Validates that the heading is not empty.
   */
  static validate(data) {
    const required = ["main_heading"];
    const missing = required.filter((field) => !data[field]);

    return {
      isValid: missing.length === 0,
      missingFields: missing,
    };
  }
}

module.exports = Hero;
