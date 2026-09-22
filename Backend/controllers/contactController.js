const ContactMessage = require('../models/ContactMessage');

exports.submitContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !phone || !subject || !message) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    await ContactMessage.createContactMessage({ name, email, phone, subject, message });
    return res.status(201).json({ message: 'Message submitted successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to submit message.', error: error.message });
  }
};

exports.getAllContacts = async (req, res) => {
  try {
    const messages = await ContactMessage.getAllContactMessages();
    return res.status(200).json(messages);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch messages.', error: error.message });
  }
};

exports.deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await ContactMessage.deleteContactMessage(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Message not found.' });
    }

    return res.status(200).json({ message: 'Message deleted successfully.' });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to delete message.',
      error: error.message
    });
  }
};
