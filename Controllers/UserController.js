const User = require("../Models/UserModel");
const bcrypt = require("bcryptjs");
const { token, adminToken } = require("../Configs/JwtToken");
const generateToken = token;
const RoomAssignment = require("../Models/RoomAssignmentsModel");

// account creation function
const userRegister = async (req, res) => {
  const {
    username,
    email,
    password,
    role = "resident",
    preferences,
  } = req.body;
  try {
    if (username && email && password) {
      //Checking user already registered in DB
      const user = await User.findOne({ email });
      //if already registered
      if (user) {
        res
          .status(200)
          .json({ message: "User already registered Please try login" });
      } else {
        //if not found in db proceed to create account
        const newUser = User({ username, email, password, role, preferences });
        await newUser.save();
        res
          .status(201)
          .json({ message: "Account Created Successfully", newUser });
      }
    } else {
      res
        .status(406)
        .json({ message: "Please Provide all the Necessary Info to Proceed" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

//user login validation with DB and create JWT token
const userLogin = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    if (email && password) {
      //Checking user already registered in DB
      const user = await User.findOne({ email });
      //if user already registered
      if (!user) {
        res
          .status(404)
          .json({ message: "User not found register before login" });
      } else {
        //Validating password for found user
        const passwordValidation = await bcrypt.compare(
          password,
          user.password
        );
        if (passwordValidation) {
          const token = await generateToken(user);
          user.token = token;
          await user.save();
          res
            .status(200)
            .json({
              message: "Login Successfully",
              token: token,
              userid: user._id,
              role: user.role,
              firstName: user.firstName?user.firstName: false,
              lastName: user.lastName?user.lastName: false,
              username: user.username,
              email: user.email,
            });
        } else {
          res
            .status(401)
            .json({ message: "unauthorized Check login Credential" });
        }
      }
    } else {
      res
        .status(406)
        .json({ message: "Please Provide all the Necessary Info to Proceed" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

//user account details get function
const userAccountDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }
    const accountDetails = {
      username: user.username || false,
      email: user.email || false,
      role: user.role || false,
      preferences: user.preferences || false,
      firstName: user.account?.firstName || false,
      lastName: user.account?.lastName || false,
      phone: user.account?.phone || false,
      address: user.account?.address || false,
      emergencyContact: user.account?.emergencyContact || false,
      CheckInDate: user.account?.CheckInDate ? new Date(user.account.CheckInDate).toISOString().split('T')[0] : false,
      CheckOutDate: user.account?.CheckOutDate ? new Date(user.account.CheckOutDate).toISOString().split('T')[0] : false
    }
    res.status(200).json({ accountDetails });
  }
    catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};


//account update function
const userAccountUpdate = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  
  const { accountDetails } = req.body;
  const account = accountDetails;
  console.log(account);
  
  
  const { firstName,lastName, phone, address, emergencyContact, CheckInDate, CheckOutDate } =
    account;
  try {
    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }
    const roomAssignment = await RoomAssignment.findOne({ residentId: id });
    
    // Update user account details
    if (firstName || lastName || phone || address || emergencyContact || CheckInDate || CheckOutDate) {
      user.account = {
      ...(user.account || {}), // Keep existing data if any
      ...(firstName && typeof firstName === 'string' && { firstName }),
      ...(lastName && typeof lastName === 'string' && { lastName }),
      ...(phone && !isNaN(phone) && { phone: Number(phone) }),
      ...(address && typeof address === 'string' && { address }),
      ...(emergencyContact && !isNaN(emergencyContact) && { emergencyContact: Number(emergencyContact) }),
      ...(CheckInDate && !isNaN(new Date(CheckInDate).getTime()) && { CheckInDate: new Date(CheckInDate) }),
      ...(CheckOutDate && !isNaN(new Date(CheckOutDate).getTime()) && { CheckOutDate: new Date(CheckOutDate) }),
      };
    } else {
      return res.status(400).json({ message: "At least one field is required for update" });
    }

    await user.save();
    if (roomAssignment) {
      roomAssignment.checkInDate = new Date(account.CheckInDate);
      roomAssignment.checkOutDate = new Date(account.CheckOutDate);
      await roomAssignment.save();
    }
    res
      .status(200)
      .json({ message: "User Account Updated Successfully", user });
     
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

//user dashboard
const userDashboard = async (req, res) => {
  res.status(200).json({ message: "User dashboard" });
};
module.exports = {
  userRegister,
  userLogin,
  userDashboard,
  userAccountUpdate,
  userAccountDetails,
};
