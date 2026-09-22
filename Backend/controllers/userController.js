const User = require("../models/userModel");

exports.getAdminProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    const { password, ...profileData } = user;
    res.json(profileData);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateAdminProfile = async (req, res) => {
  try {
    const profileData = req.body;
    
    // Log the incoming data for debugging
    console.log("Profile update data:", profileData);

    // If a file was uploaded, generate the web-accessible path
    if (req.file) {
      // Stores: uploads/avatar/avatar-12345.jpg
      profileData.avatar = `uploads/avatar/${req.file.filename}`.replace(
        /\\/g,
        "/",
      );
    }

    // Ensure fields exist in profileData
    const updateData = {
      name: profileData.name || "",
      description: profileData.description || "",
      company: profileData.company || "",
      job: profileData.job || "",
      email: profileData.email || "",
      phone: profileData.phone || "",
      location: profileData.location || "",
      socials: profileData.socials || "",
      latitude: profileData.latitude || null,
      longitude: profileData.longitude || null,
      avatar: profileData.avatar || undefined,
    };

    // Remove undefined avatar to prevent SQL issues
    if (!updateData.avatar) {
      delete updateData.avatar;
    }

    console.log("Update data to send to model:", updateData);

    await User.updateProfile(req.user.id, updateData);

    res.json({
      message: "Profile updated successfully",
      avatar: profileData.avatar,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ message: "Error updating profile", error: error.message });
  }
};
