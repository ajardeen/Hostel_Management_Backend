const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true, unique: true }, //e.g., A01 ,B12
  type: { type: String, required: true }, // e.g., Single, Double, Shared
  capacity: { type: Number, required: true }, //e.g., 1 ,2,5..
  occupied: { type: Number, require: true, default: 0 }, //e.g., 1 , 3 ...or 0
  availabilityStatus: {
    type: String,
    enum: ["Available", "Occupied", "Under Maintenance"],
    default: "Available",
  },
  features: { type: Object, default: { AC: false, WIFI: true } }, // e.g., { "AC": true, "WiFi": true }
  roomfees: { type: Number, required: true }, // e.g., 10000 this is per month
  preferences: { type: String, default: false }, // E.g., ['Near window', 'First floor']
  createdAt: { type: Date, default: Date.now }, // current date added
  updatedAt: { type: Date, default: Date.now }, // current date added
});

const Room = mongoose.model("Room", roomSchema);
module.exports = Room;
