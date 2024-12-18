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
    console.log(
      "available slots =",
      availableSlots,
      "status",
      availableSlots <= occupied
    );

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
    } else {
      return res
        .status(400)
        .json({ message: "Room already occupied its limit" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error assigning room", error });
  }
};

//update Room assignments by id from query
const updateRoomAssignments= async (req, res) => {
    try {
      const { id } = req.params;
      const { roomId, checkInDate, checkOutDate } = req.body;
  
      const assignment = await RoomAssignment.findById(id);
      if (!assignment) {
        return res.status(404).json({ message: 'Assignment not found' });
      }
  
      // Update the room assignment
      if (roomId) assignment.roomId = roomId;
      if (checkInDate) assignment.checkInDate = checkInDate;
      if (checkOutDate) assignment.checkOutDate = checkOutDate;
  
      await assignment.save();
      res.status(200).json({ message: 'Assignment updated successfully', assignment });
    } catch (error) {
      res.status(500).json({ message: 'Error updating assignment', error });
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
    })
    const inActiveAssignments = await RoomAssignment.find({
      status: "Checked Out",
    })
    res.status(200).json({message:"Successfully",activeAssignments,inActiveAssignments}); 
    

    // // Structure the response
    // const roomDetails = activeAssignments.map((assignment) => ({
    //   residentName: assignment.residentId.name,
    //   residentContact: assignment.residentId.contact,
    //   roomNumber: assignment.roomId.roomNumber,
    //   roomType: assignment.roomId.type,
    //   checkInDate: assignment.checkInDate,
    //   checkOutDate: assignment.checkOutDate,
    // }));

    // res.status(200).json({
    //   summary: {
    //     totalRooms,
    //     occupiedRooms,
    //     availableRooms,
    //   },
    //   activeAssignments: roomDetails,
    // });
  } catch (error) {
    res.status(500).json({ message: "Error fetching occupancy data", error });
  }
};

module.exports = {
  getALLRoomsDetails,
  createRoom,
  roomAssignment,
  getRoomOccupancy,
  updateRoomAssignments
};
