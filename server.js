const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require('cors');
require("dotenv").config();
const port = process.env.PORT || 5000;
const connectMongoDB = require("./Configs/ConfigDB");
const UserRoute= require("./Routes/UserRoute");
const DefaultRoute= require("./Routes/DefaultRoute");
const RoomRoutes = require('./Routes/RoomRoute')
const MaintenanceRoutes = require('./Routes/MaintenanceRoute');

app.use(cors());
app.use(bodyParser.json());
app.use("/", DefaultRoute);
app.use("/api/auth", UserRoute);
app.use("/api/adminauth",RoomRoutes)
app.use("/api/auth/maintenance",MaintenanceRoutes)
app.listen(port, (error) => {
  if (error) {
    console.log(error.message, "Server Failed to Start");
  } else {
    console.log(`Server is running on port ${port}`);
  }
});

connectMongoDB();
