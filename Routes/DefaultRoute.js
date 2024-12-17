const express = require("express");
const router = express.Router();
const {homePage} = require("../Controllers/DefaultController");

router.get("/",homePage);

module.exports = router;