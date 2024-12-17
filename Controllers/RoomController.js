const Room = require("../Models/RoomModel");
const RoomAssignment = require("../Models/RoomAssignmentsModel");

//get all the room details
const getALLRoomsDetails = async (req, res) => {
  console.log("get all");

  const allRooms = await Room.find();
  res
    .status(200)
    .json({ message: "Successfully Retrieved all the room details", allRooms });
};

//create room with post details
const createRoom = async (req, res) => {
  const { roomNumber, type, capacity, occupied, availabilityStatus, features } =
    req.body;
  const room = await Room.findOne({ roomNumber });
  //validating room already available are not
  if (room) {
    res
      .status(401)
      .json({ message: "already room created with this room number" });
    return;
  }
  const newRoom = new Room({
    roomNumber,
    type,
    capacity,
    occupied,
    availabilityStatus,
    features,
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
    if (!room || room.availabilityStatus !== "Available") {
      return res.status(400).json({ message: "Room not available" });
    }
    // validating room capacity Available
    const availableSlots = room.capacity - room.occupied;
    console.log("available slots =", availableSlots,"status",availableSlots <= occupied);

    if (availableSlots >= occupied) {
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
      room.availabilityStatus = "Available";
      await room.save();
      //save the entry
      await newAssignment.save();
  
      res
        .status(201)
        .json({ message: "Room assigned successfully", newAssignment });
    } else if (availableSlots == occupied) {
      // Update room status and Occupied
      room.occupied = room.occupied + occupied;
      room.availabilityStatus = "Occupied";
      await room.save();
    }else {
        return res
        .status(400)
        .json({ message: "Room already occupied its limit" });
    }

   
  } catch (error) {
    res.status(500).json({ message: "Error assigning room", error });
  }
};

module.exports = {
  getALLRoomsDetails,
  createRoom,
  roomAssignment,
};
