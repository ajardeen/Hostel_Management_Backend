const mongoose = require("mongoose");
require("dotenv").config();

const connectMongoDB = () => {
  try {
    mongoose.connect(process.env.MONGODB_URL);
    console.log("Successfully Database Connected");
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = connectMongoDB;
