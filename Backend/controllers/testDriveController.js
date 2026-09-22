const db = require("../config/db");

const ensureTestDrivesTable = () => {
  const query = `
    CREATE TABLE IF NOT EXISTS test_drives (
      id INT NOT NULL AUTO_INCREMENT,
      name VARCHAR(255) NOT NULL,
      phone VARCHAR(50) NOT NULL,
      email VARCHAR(255) NOT NULL,
      address VARCHAR(255) NOT NULL,
      city VARCHAR(100) NOT NULL,
      state VARCHAR(100) NOT NULL,
      postcode VARCHAR(20) NOT NULL,
      driver_license_number VARCHAR(100) NOT NULL,
      preferred_date DATE NOT NULL,
      preferred_time VARCHAR(20) NOT NULL,
      message TEXT,
      car_id INT NOT NULL,
      car_title VARCHAR(255) NOT NULL,
      status VARCHAR(50) DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      INDEX (car_id),
      INDEX (email),
      INDEX (status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;

  return new Promise((resolve, reject) => {
    db.execute(query)
      .then(() => resolve())
      .catch((error) => reject(error));
  });
};

exports.createTestDrive = async (req, res) => {
  try {
    await ensureTestDrivesTable();

    const {
      name,
      phone,
      email,
      address,
      city,
      state,
      postcode,
      driverLicenseNumber,
      preferredDate,
      preferredTime,
      message,
      carId,
      carTitle,
    } = req.body;

    // Validate required fields
    if (
      !name ||
      !phone ||
      !email ||
      !address ||
      !city ||
      !state ||
      !postcode ||
      !driverLicenseNumber ||
      !preferredDate ||
      !preferredTime ||
      !carId ||
      !carTitle
    ) {
      return res.status(400).json({
        message: "All required fields must be provided.",
      });
    }

    const [result] = await db.execute(
      `INSERT INTO test_drives 
        (name, phone, email, address, city, state, postcode, driver_license_number, 
         preferred_date, preferred_time, message, car_id, car_title, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        phone,
        email,
        address,
        city,
        state,
        postcode,
        driverLicenseNumber,
        preferredDate,
        preferredTime,
        message || null,
        carId,
        carTitle,
        "pending",
      ]
    );

    res.status(201).json({
      message: "Test drive request submitted successfully.",
      id: result.insertId,
    });
  } catch (error) {
    console.error("Error creating test drive:", error);
    res.status(500).json({ message: "Database error" });
  }
};

exports.getAllTestDrives = async (req, res) => {
  try {
    await ensureTestDrivesTable();

    const [testDrives] = await db.execute(
      `SELECT * FROM test_drives ORDER BY preferred_date DESC, preferred_time DESC`
    );

    res.status(200).json(testDrives);
  } catch (error) {
    console.error("Error fetching test drives:", error);
    res.status(500).json({ message: "Database error" });
  }
};

exports.getTestDriveById = async (req, res) => {
  try {
    const { id } = req.params;

    const [testDrive] = await db.execute(
      `SELECT * FROM test_drives WHERE id = ?`,
      [id]
    );

    if (testDrive.length === 0) {
      return res.status(404).json({ message: "Test drive not found." });
    }

    res.status(200).json(testDrive[0]);
  } catch (error) {
    console.error("Error fetching test drive:", error);
    res.status(500).json({ message: "Database error" });
  }
};

exports.getTestDrivesByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    const [testDrives] = await db.execute(
      `SELECT * FROM test_drives WHERE email = ? ORDER BY preferred_date DESC, preferred_time DESC`,
      [email]
    );

    res.status(200).json(testDrives);
  } catch (error) {
    console.error("Error fetching test drives by email:", error);
    res.status(500).json({ message: "Database error" });
  }
};

exports.getTestDrivesByCarId = async (req, res) => {
  try {
    const { carId } = req.params;

    const [testDrives] = await db.execute(
      `SELECT * FROM test_drives WHERE car_id = ? ORDER BY preferred_date DESC, preferred_time DESC`,
      [carId]
    );

    res.status(200).json(testDrives);
  } catch (error) {
    console.error("Error fetching test drives by car:", error);
    res.status(500).json({ message: "Database error" });
  }
};

exports.updateTestDrive = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, email, address, city, state, postcode, driverLicenseNumber, preferredDate, preferredTime, message, status } = req.body;

    let updateQuery = `UPDATE test_drives SET `;
    const updateFields = [];
    const updateValues = [];

    if (name) {
      updateFields.push("name = ?");
      updateValues.push(name);
    }
    if (phone) {
      updateFields.push("phone = ?");
      updateValues.push(phone);
    }
    if (email) {
      updateFields.push("email = ?");
      updateValues.push(email);
    }
    if (address) {
      updateFields.push("address = ?");
      updateValues.push(address);
    }
    if (city) {
      updateFields.push("city = ?");
      updateValues.push(city);
    }
    if (state) {
      updateFields.push("state = ?");
      updateValues.push(state);
    }
    if (postcode) {
      updateFields.push("postcode = ?");
      updateValues.push(postcode);
    }
    if (driverLicenseNumber) {
      updateFields.push("driver_license_number = ?");
      updateValues.push(driverLicenseNumber);
    }
    if (preferredDate) {
      updateFields.push("preferred_date = ?");
      updateValues.push(preferredDate);
    }
    if (preferredTime) {
      updateFields.push("preferred_time = ?");
      updateValues.push(preferredTime);
    }
    if (message) {
      updateFields.push("message = ?");
      updateValues.push(message);
    }
    if (status) {
      updateFields.push("status = ?");
      updateValues.push(status);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ message: "No fields to update." });
    }

    updateQuery += updateFields.join(", ") + " WHERE id = ?";
    updateValues.push(id);

    const [result] = await db.execute(updateQuery, updateValues);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Test drive not found." });
    }

    res.status(200).json({ message: "Test drive updated successfully." });
  } catch (error) {
    console.error("Error updating test drive:", error);
    res.status(500).json({ message: "Database error" });
  }
};

exports.updateTestDriveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required." });
    }

    const [result] = await db.execute(
      `UPDATE test_drives SET status = ? WHERE id = ?`,
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Test drive not found." });
    }

    res.status(200).json({ message: "Test drive status updated successfully." });
  } catch (error) {
    console.error("Error updating test drive status:", error);
    res.status(500).json({ message: "Database error" });
  }
};

exports.deleteTestDrive = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.execute(
      `DELETE FROM test_drives WHERE id = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Test drive not found." });
    }

    res.status(200).json({ message: "Test drive deleted successfully." });
  } catch (error) {
    console.error("Error deleting test drive:", error);
    res.status(500).json({ message: "Database error" });
  }
};
