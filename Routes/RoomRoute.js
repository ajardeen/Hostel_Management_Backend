const express = require("express");
const router = express.Router();
const { getALLRoomsDetails,createRoom,roomAssignment } = require("../Controllers/RoomController");

router.get("/getrooms", getALLRoomsDetails);
router.post('/createroom',createRoom);
router.post('/room-assignment',roomAssignment);

module.exports = router;
