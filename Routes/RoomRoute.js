const express = require("express");
const router = express.Router();
const {
  getALLRoomsDetails,
  createRoom,
  roomAssignment,
  getRoomOccupancy,
  updateRoomAssignments,
  getRoomById,
  getAllResidents,
} = require("../Controllers/RoomController");

//below all routes handled only by admin
router.get("/getrooms", getALLRoomsDetails);
router.post("/createroom", createRoom);
router.post("/room-assignment", roomAssignment);
router.get("/room-occupancy", getRoomOccupancy);
router.put("/room-assignments/:id", updateRoomAssignments);
router.get("/getroombyid/:id", getRoomById);
router.get("/getresidents", getAllResidents);

module.exports = router;
