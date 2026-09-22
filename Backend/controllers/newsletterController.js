const pool = require('../config/db');
const validateEmail = require('../utils/validateEmail');
const { sendWelcomeEmail } = require('../services/emailService');

const subscribe = async (req, res) => {
  const { email } = req.body;

  // 1. Validate email
  if (!email || !validateEmail(email)) {
    return res.status(400).json({ error: 'Invalid email' });
  }

  try {
    // 2. Prevent duplicate subscriptions
    const [existingRows] = await pool.execute(
      'SELECT id FROM newsletter_subs WHERE email = ? LIMIT 1',
      [email],
    );

    if (existingRows.length > 0) {
      return res.status(400).json({ error: 'Email already subscribed' });
    }

    await pool.execute(
      'INSERT INTO newsletter_subs (email) VALUES (?)',
      [email],
    );

    // 3. Send welcome email if configured, but don't fail subscription on mail errors
    try {
      await sendWelcomeEmail(email);
    } catch (emailErr) {
      console.warn('Newsletter welcome email failed:', emailErr.message || emailErr);
    }

    res.status(200).json({ message: 'Subscribed successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const getSubscribers = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT id, email, signup_date FROM newsletter_subs ORDER BY signup_date DESC',
    );
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Unable to fetch subscribers' });
  }
};

module.exports = { subscribe, getSubscribers };