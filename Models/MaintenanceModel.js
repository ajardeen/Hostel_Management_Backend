const mongoose = require("mongoose");

const MaintenanceRequestSchema = new mongoose.Schema({
  residentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  issueDetails: { type: String, required: true },
  priority: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Medium",
  },
  status: {
    type: String,
    enum: ["Pending", "In Progress", "Resolved", "Closed"],
    default: "Pending",
  },
  assignedTo:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:false,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("MaintenanceRequest", MaintenanceRequestSchema);
