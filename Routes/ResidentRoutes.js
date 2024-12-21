const express = require("express");
const router = express.Router();
const {
  getMaintenanceDetails,
  getResidentRoomDetails,
} = require("../Controllers/ResidentController");

router.get("/maintenance/:residentId", getMaintenanceDetails);
router.get("/room/:residentId", getResidentRoomDetails);
module.exports = router;
