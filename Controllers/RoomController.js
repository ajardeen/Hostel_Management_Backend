const Room = require("../Models/RoomModel");
const RoomAssignment = require("../Models/RoomAssignmentsModel");
const User = require("../Models/UserModel");

//get all the room details
const getALLRoomsDetails = async (req, res) => {
  const allRooms = await Room.find();
  res
    .status(200)
    .json({ message: "Successfully Retrieved all the room details", allRooms });
};

//create room with post details
const createRoom = async (req, res) => {
  const {
    roomNumber,
    type,
    capacity,
    occupied,
    availabilityStatus,
    features,
    preferences,
    roomfees,
  } = req.body;
  const room = await Room.findOne({ roomNumber });
  //validating room already available are not
  if (room) {
    res
      .status(401)
      .json({ message: "already room created with this room number" });
    return;
  }
  if (occupied == capacity) {
    availabilityStatus: "Occupied";
  }
  const newRoom = new Room({
    roomNumber,
    type,
    capacity,
    occupied,
    availabilityStatus,
    features,
    preferences,
    roomfees,
  });
  await newRoom.save();
  res.status(201).json({ message: "Successfully created ", newRoom });
};

// creating room assignment of the person
const roomAssignment = async (req, res) => {
  try {
    const { residentId, roomId, checkInDate, checkOutDate, status, occupied } =
      req.body;

    // Check if the room is available
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(400).json({ message: "Room not found" });
    }

    // validating room capacity Available
    const availableSlots = room.capacity - room.occupied;
    if (availableSlots < occupied) {
      return res
        .status(400)
        .json({ message: "Room does not have enough available slots" });
    }

    // Create a room assignment
    const newAssignment = new RoomAssignment({
      residentId,
      roomId,
      occupied,
      checkInDate,
      checkOutDate,
      status,
    });

    // Update room status and Occupied
    room.occupied += occupied;
    if (room.occupied >= room.capacity) {
      room.availabilityStatus = "Occupied";
    } else {
      room.availabilityStatus = "Available";
    }

    await room.save();
    await newAssignment.save();

    res
      .status(201)
      .json({ message: "Room assigned successfully", newAssignment });
  } catch (error) {
    console.error("Room assignment error:", error);
    res.status(500).json({ message: "Error assigning room", error: error.message });
  }
};

//update Room assignments by id from query
const updateRoomAssignments = async (req, res) => {
  try {
    const { id } = req.params;
    const { roomId, checkInDate, checkOutDate } = req.body;

    const assignment = await RoomAssignment.findById(id);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    // Update the room assignment
    if (roomId) assignment.roomId = roomId;
    if (checkInDate) assignment.checkInDate = checkInDate;
    if (checkOutDate) assignment.checkOutDate = checkOutDate;

    await assignment.save();
    res
      .status(200)
      .json({ message: "Assignment updated successfully", assignment });
  } catch (error) {
    res.status(500).json({ message: "Error updating assignment", error });
  }
};

//viewing all room assignments ,including check in check out
const getRoomOccupancy = async (req, res) => {
  try {
    // Fetch room occupancy summary
    const totalRooms = await Room.countDocuments();
    const occupiedRooms = await Room.countDocuments({
      availabilityStatus: "Occupied",
    });
    const availableRooms = await Room.countDocuments({
      availabilityStatus: "Available",
    });

    // Fetch active room assignments with resident details checked in
    const activeAssignments = await RoomAssignment.find({
      status: "Checked In",
    });
    const inActiveAssignments = await RoomAssignment.find({
      status: "Checked Out",
    });
    res.status(200).json({
      message: "Successfully",
      activeAssignments,
      inActiveAssignments,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching occupancy data", error });
  }
};

//get booking room details
const getRoomById = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await Room.findById(id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    res.status(200).json({ message: "Successfully", room });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch room details", error });
  }
};
//get all residents
const getAllResidents = async (req, res) => {
  try {
    // Fetch all residents
    const residents = await User.find({ role: "resident" });
    const residentData = residents.map((resident) => ({
      username: resident.username,
      residentid: resident._id,
      residentEmail: resident.email,
      preferences: resident.preferences,
    }));

    res.status(200).json({ message: "Successfully", residentData });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch residents", error });
  }
};

module.exports = {
  getALLRoomsDetails,
  createRoom,
  roomAssignment,
  getRoomOccupancy,
  updateRoomAssignments,
  getRoomById,
  getAllResidents,
};
