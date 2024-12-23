const mongoose = require('mongoose');

const OccupancySchema = new mongoose.Schema({
    totalRooms: { type: Number, required: true },
    occupiedRooms: { type: Number, required: true },
    date: { type: Date, required: true },
    occupancyRate: { 
      type: Number, 
      required: true, 
      default: function () {
        return (this.occupiedRooms / this.totalRooms) * 100; // Automatically calculate the rate
      },
    },
  });
  
  const Occupancy = mongoose.model('Occupancy', OccupancySchema);
  module.exports = Occupancy;
  