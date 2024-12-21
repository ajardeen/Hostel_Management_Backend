const express = require("express");
const router = express.Router();
const { createBilling } = require("../Controllers/BillingController");
router.post("/create-billing", createBilling);
module.exports = router;
