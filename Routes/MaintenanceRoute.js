const express = require("express");
const router = express.Router();
//maintenance controller
const {
  createMaintenanceRequest,
  getAllMaintenanceRequest,
  assignMaintenance,
  getResidentMaintenance,
  staffMaintenanceStatusUpdate,
} = require("../Controllers/MaintenanceController");

//staff controller
const { getAllStaff } = require("../Controllers/StaffController");

router.get("/getstaffs", getAllStaff);

//by resident
router.post("/create-maintenance-requests", createMaintenanceRequest);
router.get(
  "/maintenance-requests/resident/:residentId",
  getResidentMaintenance
);

//by admin
router.get("/maintenance-requests", getAllMaintenanceRequest);
router.put("/maintenance-requests/assign", assignMaintenance);


//by staff
router.put("/maintenance-requests/:id/status", staffMaintenanceStatusUpdate);
module.exports = router;
