const db = require("../config/db");

const User = {
  // Existing methods...
  findByEmail: async (email) => {
    const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    return rows[0];
  },

  findById: async (id) => {
    const [rows] = await db.execute("SELECT * FROM users WHERE id = ?", [id]);
    return rows[0];
  },

  updateProfile: async (id, data) => {
    const {
      name,
      description,
      company,
      job,
      email,
      phone,
      location,
      socials,
      avatar,
    } = data;

    // We build the query dynamically to only update the avatar if a new one is uploaded
    let query = `
      UPDATE users 
      SET name = ?, description = ?, company = ?, job = ?, email = ?, 
          phone = ?, location = ?, socials = ?
    `;
    let params = [
      name,
      description,
      company,
      job,
      email,
      phone,
      location,
      socials,
    ];

    if (avatar) {
      query += `, avatar = ?`;
      params.push(avatar);
    }

    query += ` WHERE id = ?`;
    params.push(id);

    return await db.execute(query, params);
  },
};

module.exports = User;
