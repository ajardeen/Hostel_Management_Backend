const express = require("express");
const router = express.Router();
const {
  createMaintenanceRequest,
  getAllMaintenanceRequest,
  assignMaintenance,
  getResidentMaintenance,
  staffMaintenanceStatusUpdate,
} = require("../Controllers/MaintenanceController");

//by resident
router.post("/create-maintenance-requests", createMaintenanceRequest);
router.get(
  "/maintenance-requests/resident/:residentId",
  getResidentMaintenance
);

//by admin
router.get("/maintenance-requests", getAllMaintenanceRequest);
router.post("/maintenance-requests/:id/assign", assignMaintenance);

//by staff
router.put("/maintenance-requests/:id/status",staffMaintenanceStatusUpdate);
module.exports = router;
