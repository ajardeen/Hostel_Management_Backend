const MaintenanceRequest = require("../Models/MaintenanceModel");
const User = require("../Models/UserModel");
//create Maintenance request from resident
const createMaintenanceRequest = async (req, res) => {
  try {
    
    const { residentId, issueDetails, priority } = req.body;
    const resident = User.findOne({ _id: residentId });
    if (!resident) {
      return res.status(404).json({
        message: "User not found so maintenance request not assigned",
      });
    }
    const newRequest = new MaintenanceRequest({
      residentId,
      issueDetails,
      priority,
    });

    await newRequest.save();
    res.status(201).json({
      message: "Maintenance request submitted successfully",
      request: newRequest,
    });
  } catch (error) {
    console.log(error.message);

    res.status(500).json({ message: "Failed to submit maintenance request" });
  }
};

//Admin to view all maintenance request
const getAllMaintenanceRequest = async (req, res) => {
  try {
    const requests = await MaintenanceRequest.find();

    res.status(200).json(requests);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch maintenance requests", error });
  }
};

//admin assign maintenance request to staff
const assignMaintenance = async (req, res) => {
  try {
    console.log("assigned");
    
    const { assignedTo ,id} = req.body; // Staff ID and Maintenance request id

    const updatedRequest = await MaintenanceRequest.findByIdAndUpdate(
      id,
      { assignedTo, status: "In Progress", updatedAt: Date.now() },
      { new: true }
    );
    console.log(updatedRequest);
    
    res
      .status(200)
      .json({ message: "Request assigned successfully", updatedRequest });
  } catch (error) {
    console.log(error.message);
    
    res
      .status(500)
      .json({ message: "Failed to assign maintenance request", error });
  }
};

//Resident view their request
const getResidentMaintenance = async (req, res) => {
  try {
    const { residentId } = req.params;
    const resident = await MaintenanceRequest.find({ residentId });
    if (!resident) {
      return res.status(404).json({ message: "Resident not found" });
    }
    res.status(200).json({ message: "Successfully", resident });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch resident maintenance requests",
      error,
    });
  }
};
// Staff updates the status of assigned maintenance requests
const staffMaintenanceStatusUpdate = async (req, res) => {
  try {
    const { id } = req.params; // Maintenance request id
    const { status } = req.body; // Maintenance request status
    console.log("status update");

    const updatedRequest = await MaintenanceRequest.findByIdAndUpdate(
      id,
      { status, updatedAt: Date.now() },
      { new: true }
    );

    res.status(200).json({ message: "Request status updated", updatedRequest });
  } catch (error) {
    res.status(500).json({ message: "Failed to update request status", error });
  }
};



module.exports = {
  createMaintenanceRequest,
  getAllMaintenanceRequest,
  assignMaintenance,
  getResidentMaintenance,
  staffMaintenanceStatusUpdate,
};
