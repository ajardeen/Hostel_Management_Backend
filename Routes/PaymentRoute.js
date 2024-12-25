const express = require("express");
const router = express.Router();
const {
  checkoutAndUpdateRevenue,
  getAllPayments,
} = require("../Controllers/PaymentsController");
const authMiddleware = require("../Middlewares/authMiddleware");

router.post(
  "/checkoutAndUpdateRevenue",
  authMiddleware,
  checkoutAndUpdateRevenue
);
router.get("/getAllPayments", authMiddleware, getAllPayments);
module.exports = router;
