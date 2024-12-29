const express = require("express");
const router = express.Router();
const {
  getMaintenanceRequestByStaffId,
} = require("../Controllers/StaffController");

router.get("/maintenance-requests/:id", getMaintenanceRequestByStaffId);

module.exports = router;
