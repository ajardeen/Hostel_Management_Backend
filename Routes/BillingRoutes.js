const express = require("express");
const router = express.Router();
const { createBilling } = require("../Controllers/BillingController");
const authMiddleware = require("../Middlewares/authMiddleware");
router.post("/create-billing",authMiddleware, createBilling);
module.exports = router;
