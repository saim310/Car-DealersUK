const db = require('../config/db');

// Get all available features for the "Add Listing" checkboxes
exports.getAllFeatures = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM features');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get features for a specific listing (Listing Detail Page)
exports.getListingFeatures = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query(
            `SELECT f.name FROM features f 
             JOIN listing_features lf ON f.id = lf.feature_id 
             WHERE lf.listing_id = ?`, [id]
        );
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};