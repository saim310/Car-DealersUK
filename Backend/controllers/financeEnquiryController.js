const db = require("../config/db");
const { sendFinanceEnquiryNotification } = require("../services/emailService");

const ensureFinanceEnquiriesTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS finance_enquiries (
      id INT NOT NULL AUTO_INCREMENT,
      borrow_amount VARCHAR(100),
      years INT,
      use_type VARCHAR(100),
      employment_status VARCHAR(100),
      residency_status VARCHAR(100),
      property_owner VARCHAR(50),
      finance_before VARCHAR(50),
      credit_history VARCHAR(255),
      full_name VARCHAR(255) NOT NULL,
      phone VARCHAR(50) NOT NULL,
      email VARCHAR(255) NOT NULL,
      message TEXT,
      documents LONGTEXT,
      confirmed BOOLEAN DEFAULT true,
      recaptcha_token VARCHAR(500),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;

  await db.execute(query);

  try {
    await db.execute("ALTER TABLE finance_enquiries ADD COLUMN documents LONGTEXT");
  } catch (err) {
    // Ignore error if column already exists
  }
};

const parseEnquiryDocuments = (enquiry) => {
  if (!enquiry) return enquiry;
  let parsedDocs = [];
  if (enquiry.documents) {
    if (typeof enquiry.documents === "string") {
      try {
        parsedDocs = JSON.parse(enquiry.documents);
      } catch (e) {
        parsedDocs = [];
      }
    } else if (Array.isArray(enquiry.documents)) {
      parsedDocs = enquiry.documents;
    }
  }
  return {
    ...enquiry,
    documents: parsedDocs,
  };
};

exports.createFinanceEnquiry = async (req, res) => {
  try {
    await ensureFinanceEnquiriesTable();

    const {
      borrowAmount,
      years,
      useType,
      employmentStatus,
      residencyStatus,
      propertyOwner,
      financeBefore,
      creditHistory,
      fullName,
      phone,
      email,
      message,
      confirmed,
      recaptchaToken,
    } = req.body;

    // Validate required fields
    if (!fullName || !phone || !email) {
      return res.status(400).json({
        message: "Full Name, Phone, and Email are required.",
      });
    }

    // Process uploaded documents if present
    let documentsList = [];
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      documentsList = req.files.map((file) => ({
        name: file.originalname,
        url: `/uploads/finance/${file.filename}`,
        type: file.mimetype,
        size: file.size,
        uploaded_at: new Date().toISOString(),
      }));
    } else if (req.body.documents) {
      try {
        documentsList = typeof req.body.documents === "string"
          ? JSON.parse(req.body.documents)
          : req.body.documents;
      } catch (e) {
        documentsList = [];
      }
    }

    // Process confirmed boolean value safely for MySQL TINYINT(1)
    const confirmedVal = (confirmed === true || confirmed === "true" || confirmed === 1 || confirmed === "1" || confirmed === undefined || confirmed === null) ? 1 : 0;
    const parsedYears = years ? parseInt(years, 10) || null : null;

    const [result] = await db.execute(
      `INSERT INTO finance_enquiries 
        (borrow_amount, years, use_type, employment_status, residency_status, 
         property_owner, finance_before, credit_history, full_name, phone, email, message, documents, confirmed, recaptcha_token)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        borrowAmount || null,
        parsedYears,
        useType || null,
        employmentStatus || null,
        residencyStatus || null,
        propertyOwner || null,
        financeBefore || null,
        creditHistory || null,
        fullName,
        phone,
        email,
        message || null,
        JSON.stringify(documentsList),
        confirmedVal,
        recaptchaToken || null,
      ]
    );

    res.status(201).json({
      message: "Finance enquiry submitted successfully.",
      id: result.insertId,
    });

    // Send email notification to admin
    await sendFinanceEnquiryNotification({
      fullName,
      email,
      phone,
      borrowAmount,
      years,
      useType,
      employmentStatus,
      residencyStatus,
      propertyOwner,
      financeBefore,
      creditHistory,
      message,
    });
  } catch (error) {
    console.error("Error creating finance enquiry:", error);
    res.status(500).json({ message: "Database error" });
  }
};

exports.getAllFinanceEnquiries = async (req, res) => {
  try {
    await ensureFinanceEnquiriesTable();

    const [enquiries] = await db.execute(
      `SELECT * FROM finance_enquiries ORDER BY created_at DESC`
    );

    const formatted = enquiries.map(parseEnquiryDocuments);

    res.status(200).json(formatted);
  } catch (error) {
    console.error("Error fetching finance enquiries:", error);
    res.status(500).json({ message: "Database error" });
  }
};

exports.getFinanceEnquiryById = async (req, res) => {
  try {
    const { id } = req.params;

    const [enquiry] = await db.execute(
      `SELECT * FROM finance_enquiries WHERE id = ?`,
      [id]
    );

    if (enquiry.length === 0) {
      return res.status(404).json({ message: "Finance enquiry not found." });
    }

    res.status(200).json(parseEnquiryDocuments(enquiry[0]));
  } catch (error) {
    console.error("Error fetching finance enquiry:", error);
    res.status(500).json({ message: "Database error" });
  }
};

exports.updateFinanceEnquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const [result] = await db.execute(
      `UPDATE finance_enquiries SET ? WHERE id = ?`,
      [updates, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Finance enquiry not found." });
    }

    res.status(200).json({ message: "Finance enquiry updated successfully." });
  } catch (error) {
    console.error("Error updating finance enquiry:", error);
    res.status(500).json({ message: "Database error" });
  }
};

exports.deleteFinanceEnquiry = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.execute(
      `DELETE FROM finance_enquiries WHERE id = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Finance enquiry not found." });
    }

    res.status(200).json({ message: "Finance enquiry deleted successfully." });
  } catch (error) {
    console.error("Error deleting finance enquiry:", error);
    res.status(500).json({ message: "Database error" });
  }
};
