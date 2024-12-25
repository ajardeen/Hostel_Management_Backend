const express = require("express");
const router = express.Router();
//staff controller
const { getAllStaff } = require("../Controllers/StaffController");
//maintenance controller
const {
  createMaintenanceRequest,
  getAllMaintenanceRequest,
  assignMaintenance,
  getResidentMaintenance,
  staffMaintenanceStatusUpdate,
  deleteMaintenanceRequest,
  registerExpense,
} = require("../Controllers/MaintenanceController");
const authMiddleware = require("../Middlewares/authMiddleware");


router.get("/getstaffs", authMiddleware, getAllStaff);

//by resident
router.post(
  "/create-maintenance-requests",
  authMiddleware,
  createMaintenanceRequest
);
router.get(
  "/maintenance-requests/resident/:residentId",
  authMiddleware,
  getResidentMaintenance
);

//by admin
router.get("/maintenance-requests", authMiddleware, getAllMaintenanceRequest);
router.put("/maintenance-requests/assign", authMiddleware, assignMaintenance);
router.delete(
  "/maintenance-requests/:id",
  authMiddleware,
  deleteMaintenanceRequest
);
router.post("/register-expense", authMiddleware, registerExpense);
//by staff
router.put(
  "/maintenance-requests/:id/status",
  authMiddleware,
  staffMaintenanceStatusUpdate
);
module.exports = router;
