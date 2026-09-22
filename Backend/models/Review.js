/**
 * Review Model
 * This file defines the structure of a "Car Review" object.
 */
class Review {
  constructor(data) {
    this.id = data.id;
    this.listing_id = data.listing_id;
    this.user_id = data.user_id || null;
    this.author_name = data.author_name;
    this.author_email = data.author_email;
    this.rating = data.rating;
    this.category = data.category || 'all'; // all, mileage, performance, safety, looks, comfort
    this.title = data.title;
    this.review_text = data.review_text;
    this.images_json = data.images_json || null;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  /**
   * Validate required fields
   */
  static validate(data) {
    const required = ['listing_id', 'author_name', 'rating', 'review_text'];
    const missing = required.filter(field => !data[field]);
    
    return {
      isValid: missing.length === 0,
      missingFields: missing
    };
  }
}

module.exports = Review;
