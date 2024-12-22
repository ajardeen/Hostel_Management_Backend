const express = require("express");
const router = express.Router();
const authMiddleware = require("../Middlewares/authMiddleware");
const {
  getMaintenanceDetails,
  getResidentRoomDetails,
  generateInvoice,
} = require("../Controllers/ResidentController");

router.get("/maintenance/:residentId",authMiddleware, getMaintenanceDetails);
router.get("/room/:residentId",authMiddleware, getResidentRoomDetails);
router.get("/invoice/:residentId",authMiddleware, generateInvoice);
module.exports = router;
