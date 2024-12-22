const Maintenance = require("../Models/MaintenanceModel");
const User = require("../Models/UserModel");
const RoomAssignment = require("../Models/RoomAssignmentsModel");
const Room = require("../Models/RoomModel");

//get maintenance details for specific resident
const getMaintenanceDetails = async (req, res) => {
  try {
    const { residentId } = req.params;
    const maintenanceDetails = await Maintenance.find({ residentId });

    const filteredData = await Promise.all(
      maintenanceDetails.map(async (entry) => {
        const staff = await User.findById(entry.assignedTo);

        return {
          residentId: entry.residentId,
          issueDetails: entry.issueDetails,
          priority: entry.priority,
          status: entry.status,
          assignedTo: staff ? staff.username : "staff Not assigned",
        };
      })
    );

    res.status(200).json({ message: "Successfully", filteredData });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching maintenance details", error });
  }
};

//get resident room details
const getResidentRoomDetails = async (req, res) => {
  try {
    const { residentId } = req.params;
    // Fetch room assignment details for the resident specified
    const roomAssignment = await RoomAssignment.findOne({ residentId });
    if (!roomAssignment) {
      return res.status(404).json({ message: "Room assignment not found" });
    }
    // Fetch room details using the roomId from the room assignment
    const room = await Room.findById(roomAssignment.roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    const roomDetails = {
      roomNumber: room.roomNumber,
      roomType: room.roomType,
      roomFees: room.roomfees,
      roomStatus: roomAssignment.status,
      roomOccupancy: room.occupied,
      checkInDate: roomAssignment.checkInDate,
      checkOutDate: roomAssignment.checkOutDate,
    };
    res.status(200).json({ message: "Successfully", roomDetails });
  } catch (error) {
    res.status(500).json({ message: "Internal Server", error });
  }
};

//checkout resident from the room
const checkoutResident = async (req, res) => {
  try {
    const { residentId } = req.params;
    const roomAssignment = await RoomAssignment.findOne({ residentId });
    if (!roomAssignment) {
      return res.status(404).json({ message: "Room assignment not found" });
    }
    roomAssignment.status = "Checked Out";
    roomAssignment.checkOutDate = new Date();
    await roomAssignment.save();
    res.status(200).json({ message: "Resident checked out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error checking out resident", error });
  }
};
//generate invoice for the resident specific
const generateInvoice = async (req, res) => {
  try {
    const { residentId } = req.params;
    const roomAssignment = await RoomAssignment.findOne({ residentId });
    const user = await User.findById(residentId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!roomAssignment) {
      return res.status(404).json({ message: "Room assignment not found" });
    }
    const { roomId, checkInDate, checkOutDate, utilities } = roomAssignment;
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    const { roomNumber, roomType, roomfees } = room;
    const { username, email } = user;
    const { washing, electricity, water, internet, maintenance, cleaning } =
      utilities;
    const invoiceDate = new Date();
    const invoiceNumber = `INV-${invoiceDate.getFullYear()}-${
      invoiceDate.getMonth() + 1
    }-${invoiceDate.getDate()}-${Math.floor(Math.random() * 1000)}`;
   
    const subTotal =
      roomfees +
      washing +
      electricity +
      water +
      internet +
      maintenance +
      cleaning;
     
      
    const tax = 0.1 * subTotal;
    const total = subTotal + tax;
    console.log(total);
    
    const invoiceDetails = {
      invoiceNumber,
      invoiceDate,
      username,
      email,
      roomNumber,
      roomType,
      roomfees,
      checkInDate,
      checkOutDate,
      washing,
      electricity,
      water,
      internet,
      maintenance,
      cleaning,
      subTotal,
      tax,
      total,
    };
    res
      .status(200)
      .json({ message: "Successfully Generated Invoice", invoiceDetails });
  } catch (error) {
    res.status(500).json({ message: "Failed to generate invoice", error });
  }
};

module.exports = {
  getMaintenanceDetails,
  getResidentRoomDetails,
  generateInvoice,
};
