const express = require("express");
const router = express.Router();
const {
  userRegister,
  userLogin,
  userDashboard,
} = require("../Controllers/UserController");
const authMiddleware = require("../Middlewares/authMiddleware");

router.post("/register", userRegister);
router.post("/login", userLogin);
router.get("/userdashboard", authMiddleware, userDashboard);

module.exports = router;
