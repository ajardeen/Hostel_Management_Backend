const express = require('express');
const router = express.Router();
const {getMaintenanceRequestByStaffId} = require('../controllers/StaffController');

router.get('/maintenance-requests/:id', getMaintenanceRequestByStaffId);

module.exports = router;