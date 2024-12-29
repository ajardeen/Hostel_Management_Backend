const Room = require("../Models/RoomModel");
const RoomAssignment = require("../Models/RoomAssignmentsModel");
const User = require("../Models/UserModel");
const mailer = require("../Configs/Mailer");
require("dotenv").config();
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
    const {
      residentId,
      roomId,
      checkInDate,
      checkOutDate,
      status,
      occupied,
      utilities,
    } = req.body;

    // Check if the room is available
    const room = await Room.findById(roomId);
    const resident = await User.findById(residentId);
    if (!resident) {
      return res.status(404).json({ message: "Resident not found" });
    }
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
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
      utilities,
    });

    // Update room status and Occupied
    room.occupied += parseInt(occupied);
    if (room.occupied >= room.capacity) {
      room.availabilityStatus = "Occupied";
    } else {
      room.availabilityStatus = "Available";
    }

    await room.save();
    await newAssignment.save();
    // Update resident account details for checkIn date and checkout date in user
    resident.account.CheckInDate = checkInDate;
    resident.account.CheckOutDate = checkOutDate;
    await resident.save();

    res
      .status(201)
      .json({ message: "Room assigned and Mail is Sended ", newAssignment });

    // Send mail
    await mailer.sendMail({
      from: process.env.SMTP_USER,
      to: resident.email,
      subject: `Room Assigned Successfully`,
      html: `
      <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); overflow: hidden;">
              <div style="background-color: #4caf50; color: #ffffff; padding: 20px; text-align: center;">
                  <h1 style="margin: 0;">Hi ${resident.username}</h1>
              </div>
              <div style="padding: 20px;">
                  <p>We are pleased to inform you that your room has been successfully assigned.</p>
                  <p>Room No:${room.roomNumber}</p>
                  <p>Click the button below to login into website and view your room:</p>
                  <div style="text-align: center; margin: 20px 0;">
                      <a href="http://localhost:5173/" style="background-color: #4caf50; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-size: 16px;">
                          Login
                      </a>
                  </div>
                  <p>If you have any questions, feel free to contact us.</p>
                  <p>Thank you,</p>
                  <p><strong>Hostel Management Team</strong></p>
              </div>
              <div style="background-color: #f1f1f1; text-align: center; padding: 10px; font-size: 12px; color: #777;">
                  <p>This is an automated message. Please do not reply.</p>
              </div>
          </div>
      </div>
  `,
    });
  } catch (error) {
    console.error("Room assignment error:", error);
    res
      .status(500)
      .json({ message: "Error assigning room", error: error.message });
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

//get booking room details
const getRoomById = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await Room.findById(id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    // Fetch all residents
    const residents = await User.find({ role: "resident" });
    const residentData = await Promise.all(
      residents.map(async (resident) => {
        const hasRoom = await RoomAssignment.findOne({
          residentId: resident._id,
        });
        if (!hasRoom) {
          return {
            username: resident.username,
            residentId: resident._id,
            residentEmail: resident.email,
            preferences: resident.preferences,
          };
        }
      })
    );
    const filteredResidentData = residentData.filter(Boolean);
    res
      .status(200)
      .json({ message: "Successfully", room, filteredResidentData });
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

// getting all room assignments
const getAllAssignedRooms = async (req, res) => {
  try {
    const roomAssignments = await RoomAssignment.find();
    res.status(200).json({ message: "Successfully", roomAssignments });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "unSuccessful" });
  }
};
const updateRoomAssignmentsDates = async (req, res) => {
  try {
    const { id } = req.params;
    const { data } = req.body;
    const roomAssign = await RoomAssignment.findById(id);
    if (!roomAssign) {
      return res.status(404).json({ message: "not found" });
    }
    roomAssign.checkInDate = data.checkInDate;
    roomAssign.checkOutDate = data.checkOutDate;
    await roomAssign.save();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "unSuccessful" });
  }
};
const deleteRoomAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const roomAssign = await RoomAssignment.findById(id);
    const room = await Room.findById(roomAssign.roomId);
    room.occupied -= roomAssign.occupied;
    room.availabilityStatus = "Available";
    await room.save();
    await RoomAssignment.findByIdAndDelete(id);
    res.status(200).json({ message: "Successfully deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error" });
  }
};

// delete room 
const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await Room.findById(id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    await Room.findByIdAndDelete(id);
    res.status(200).json({ message: "Successfully deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error" });
  }
};

module.exports = {
  getALLRoomsDetails,
  createRoom,
  roomAssignment,
  updateRoomAssignments,
  getRoomById,
  getAllResidents,
  getAllAssignedRooms,
  updateRoomAssignmentsDates,
  deleteRoomAssignment,
  deleteRoom,
};
