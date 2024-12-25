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
const BillingRoutes = require('./Routes/BillingRoutes');
const ResidentRoutes = require('./Routes/ResidentRoutes');
const DashboardRoutes = require('./Routes/DashboardRoutes');
const StaffRoutes = require('./Routes/StaffRoutes');
const  PaymentRoute = require('./Routes/PaymentRoute');

app.use(cors());
app.use(bodyParser.json());
app.use("/", DefaultRoute);
app.use("/api/auth", UserRoute);
app.use("/api/auth",RoomRoutes)
app.use("/api/auth",BillingRoutes)
app.use("/api/auth", DashboardRoutes)
app.use("/api/auth",StaffRoutes)
app.use("/api/auth",PaymentRoute)
app.use("/api/auth/maintenance",MaintenanceRoutes)
app.use("/api/auth/resident",ResidentRoutes)
app.listen(port, (error) => {
  if (error) {
    console.log(error.message, "Server Failed to Start");
  } else {
    console.log(`Server is running on port ${port}`);
  }
});

connectMongoDB();
