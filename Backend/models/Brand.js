/**
 * Brand Model
 */
class Brand {
  constructor(data) {
    this.id = data.id || null;
    this.name = data.name;
    this.image = data.image; // Logo URL or path
    this.qty = data.qty || 0; // Number of cars in inventory
  }

  static validate(data) {
    const required = ["name", "image"];
    const missing = required.filter((field) => !data[field]);

    return {
      isValid: missing.length === 0,
      missingFields: missing,
    };
  }
}

module.exports = Brand;
