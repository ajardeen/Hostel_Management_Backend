const User = require("../Models/UserModel");

const getAllStaff = async (req, res) => {
  try {
    const staff = await User.find({ role: "staff" });
    if (!staff) {
      return res.status(404).json({ message: "No staff found" });
    }
    res.status(200).json({message:"Successfully",staff}); 
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch staff members" });
  }
};
module.exports = {
  getAllStaff,
};