const express = require("express");
require("dotenv").config({ path: "../.env" });

console.log("DB USER:", process.env.DB_USER);
console.log("DB PASS:", process.env.DB_PASSWORD);

const cors = require("cors");
const path = require("path");
const authRoutes = require("./routes/authRoute");
const heroRoutes = require("./routes/heroRoutes");
const userRoutes = require("./routes/userRoutes");
const listingRoutes = require("./routes/listingRoutes");
const blogRoutes = require("./routes/blogRoutes");
const brandRoutes = require("./routes/brandRoutes");
const footerRoutes = require("./routes/footerRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const newsletterRoutes = require('./routes/newsletterRoutes');
const leadRoutes = require('./routes/leadRoutes');
const saleReportRoutes = require('./routes/saleReportRoutes');
const bodyTypeRoutes = require('./routes/bodyTypeRoutes');
const modelRoutes = require('./routes/modelRoutes');
const financeEnquiryRoutes = require('./routes/financeEnquiryRoutes');
const testDriveRoutes = require('./routes/testDriveRoutes');
const contactRoutes = require('./routes/contactRoutes'); // ✅ import here with others


const app = express(); // ✅ app defined before any app.use()

app.use(cors({
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", authRoutes);
app.use("/api/hero", heroRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/footer", footerRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/features', require('./routes/featureRoutes'));
app.use('/api/leads', leadRoutes);
app.use('/api/sale-reports', saleReportRoutes);
app.use('/api/body-types', bodyTypeRoutes);
app.use('/api/models', modelRoutes);
app.use('/api/finance-enquiries', financeEnquiryRoutes);
app.use('/api/test-drives', testDriveRoutes);
app.use('/api/contact', contactRoutes); // ✅ used here with others
// app.use("/api/testamonials", require("./routes/testamonialRoutes")); // ✅ testamonial routes added here

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
