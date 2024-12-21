const mongoose = require("mongoose");

const residentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    preferences: [String], // E.g., ['Single room', 'Near restroom']
    roomAssigned: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', default: null },
    checkInDate: { type: Date },
    checkOutDate: { type: Date },
  });
  