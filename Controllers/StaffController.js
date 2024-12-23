const User = require("../Models/UserModel");
const Maintenance = require("../Models/MaintenanceModel");

const getAllStaff = async (req, res) => {
  try {
    const staff = await User.find({ role: "staff" });
    if (!staff) {
      return res.status(404).json({ message: "No staff found" });
    }
    res.status(200).json({ message: "Successfully", staff });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch staff members" });
  }
};

//get maintenance request based on staff id
const getMaintenanceRequestByStaffId = async (req, res) => {
  try {
    const {id} = req.params;
    const maintenanceRequests = await Maintenance.find({ assignedTo: id });
    if (!maintenanceRequests) {
      return res
        .status(404)
        .json({
          message: "No maintenance requests found for this staff member",
        });
    }
    res.status(200).json({ message: "Successfully", maintenanceRequests });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch maintenance requests" });
  }
};
module.exports = {
  getAllStaff,
  getMaintenanceRequestByStaffId,
};
