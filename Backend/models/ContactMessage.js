const db = require('../config/db');

const ensureContactMessagesTable = async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL,
      phone VARCHAR(20) NOT NULL,
        subject VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

const createContactMessage = async ({ name, email, phone, subject, message }) => {
  await ensureContactMessagesTable();
  const [result] = await db.query(
    'INSERT INTO contact_messages (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)',
    [name, email, phone, subject, message]
  );
  return result.insertId;
};

const getAllContactMessages = async () => {
  await ensureContactMessagesTable();
  const [rows] = await db.query('SELECT * FROM contact_messages ORDER BY created_at DESC');
  return rows;
};
const deleteContactMessage = async (id) => {
  await ensureContactMessagesTable();
  const [result] = await db.query(
    'DELETE FROM contact_messages WHERE id = ?',
    [id]
  );
  return result;
};

module.exports = {
  createContactMessage,
  getAllContactMessages,
  deleteContactMessage,
};
