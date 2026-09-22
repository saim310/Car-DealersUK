require('dotenv').config({path: '../.env'});

  console.log("DB USER:", process.env.DB_USER);
console.log("DB PASS:", process.env.DB_PASSWORD);

const jwt = require('jsonwebtoken');

const verifyAdmin = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Get token from "Bearer <token>"

  if (!token) return res.status(401).json({ message: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = verifyAdmin;