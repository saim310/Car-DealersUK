/**
 * Listing Model
 * This file defines the structure of a "Car Listing" object.
 */
class Listing {
    constructor(data) {
        this.id = data.id || Date.now(); // Unique ID
        this.listing_title = data.listing_title;
        this.model = data.model;
         this.brand = data.brand;
         this.price = data.price;
        this.type = data.type;
         this.years = data.years;
        this.condition = data.condition;
        this.mileage = data.mileage;
        this.transmission = data.transmission;
          this.fuel_type = data.fuel_type;
             this.description = data.description;
        this.features = data.features || [];
        this.plate_number = data.plate_number;
        this.road_tax = data.road_tax;
        this.status = data.status || "in_stock"; // Can be: in_stock, in_transit, on_order
        // this.engine_size = data.engine_size;
        // this.cylinders = data.cylinders;
      
        // this.doors = data.doors;
        // this.color = data.color;
        // this.seats = data.seats;
     
        this.location = data.location;
        this.full_address = data.full_address;
        this.map_location = data.map_location;
        this.video_url = data.video_url;
        this.images = data.images || [];
        this.attachments = data.attachments || [];
    }

    /**
     * Static method to validate if the required fields are present
     * before we even try to save it.
     */
    static validate(data) {
        const required = ['listing_title', 'model', 'brand'];
        const missing = required.filter(field => !data[field]);
        
        // Price is required for in_stock status
        const status = data.status || "in_stock";
        if (status === "in_stock" && !data.price) {
            missing.push('price');
        }
        
        return {
            isValid: missing.length === 0,
            missingFields: missing
        };
    }
}

module.exports = Listing;