const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
router.use(express.json());

// Route to get all users
router.get("/", async (req, res) => {
  try {
    // Fetch all users from the database excluding sensitive information
    const users = await User.find({}, { __v: false, password: false });
    res.json({ status: "Success", data: { users } });
  } catch (err) {
    // Handle server error
    res.status(500).json({ message: err.message });
  }
});

// Route to register a new user
router.post("/register", async (req, res) => {
  try {
    // Hash the user's password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    // Create a new user based on the request body
    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: hashedPassword,
      email: req.body.email,
      role: req.body.role,
    });

    // Save the new user to the database
    const newUser = await user.save();

    // Generate a JWT token for the newly registered user
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    // Respond with the token and user data
    res.status(201).json({ status: "Success", data: { newUser, token } });
  } catch (err) {
    // Log and handle registration errors
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

// Route to handle user login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find the user with the provided email
    const user = await User.findOne({ email });

    // Check if the user exists
    if (!user) {
      console.log("User not found");
      return res.status(404).json("User not found");
    }

    // Verify the provided password against the hashed password in the database
    const matchedPassword = await bcrypt.compare(password, user.password);

    if (matchedPassword) {
      // Generate a JWT token for the authenticated user
      const token = jwt.sign(
        { userId: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1h" }
      );
      // Return the token to the client along with a success message
      return res.status(200).json({ token, message: "Login successful" });
    } else {
      // If the password is incorrect, return an error message
      return res.status(401).json("Password is incorrect");
    }
  } catch (err) {
    // Handle login errors
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
