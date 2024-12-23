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
const authMiddleware = require("../Middlewares/authMiddleware");

//below all routes handled only by admin
router.get("/getrooms",authMiddleware, getALLRoomsDetails);
router.post("/createroom",authMiddleware, createRoom);
router.post("/room-assignment", authMiddleware,roomAssignment);
router.put("/room-assignments/:id",authMiddleware, updateRoomAssignments);
router.get("/getroombyid/:id",authMiddleware, getRoomById);
router.get("/getresidents",authMiddleware, getAllResidents);

module.exports = router;
