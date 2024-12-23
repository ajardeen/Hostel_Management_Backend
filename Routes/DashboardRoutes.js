const express = require("express");
const router = express.Router();
const authMiddleware = require("../Middlewares/authMiddleware");
const {
  getDashboardData,
  createExpense,
  deleteExpense,
  createRevenue,
} = require("../Controllers/DashboardController");
const { route } = require("./UserRoute");

router.get("/dashboard", authMiddleware,getDashboardData);
router.post("/add-expense", authMiddleware,createExpense);
router.delete("/delete-expense/:id",authMiddleware, deleteExpense);
router.post("/add-revenue",authMiddleware, createRevenue);

module.exports = router;