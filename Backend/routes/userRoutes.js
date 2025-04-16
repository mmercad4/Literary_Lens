const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Import the User model
const router = express.Router();

// POST route for user login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
  
    try {
      // Check if the user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }
  
      // Compare the password with the hashed password stored in the database
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }
  
      // Create JWT token
      const payload = {
        userId: user._id,
        email: user.email,
      };
  
      const token = jwt.sign(payload, 'your_secret_key', { expiresIn: '1h' }); // Set your secret key and expiration time
  
      // Send the token to the client
      res.status(200).json({
        message: 'Login successful',
        token: token, // The JWT token
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

// Register a new user
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  // Check if all fields are provided
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Please provide all required fields.' });
  }

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email is already registered.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword, // Save the hashed password
    });

    // Save user to the database
    await newUser.save();

    // Create a token (optional)
    const token = jwt.sign({ id: newUser._id }, 'yourSecretKey', { expiresIn: '1h' });

    // Respond with the user data and token
    res.status(201).json({
      message: 'User registered successfully',
      user: { username: newUser.username, email: newUser.email },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

router.post("/get-saved-images", async (req, res) => {
    console.log("User saved images route hit!");
    try {
        const userId = req.body.userId; // Extract user ID from request body

        if (!userId) {
            return res.status(400).json({ message: 'No user ID provided.' });
        }

        // Fetch the user's saved images
        const user = await User.findById(userId).populate('savedImages');
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        
        res.status(200).json(user.savedImages);

    } catch (error) {
        console.error('Error fetching saved images:', error);
        res.status(500).json({ message: 'Failed to fetch saved images' });
    }
});

module.exports = router;
