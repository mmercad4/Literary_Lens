const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Image = require('../models/image'); // Import the Image model
const router = express.Router();
const authenticate = require('../middleware/auth.js');

// Post route for image saving
router.post('/save', authenticate, async (req, res) => {
    console.log("Image save route hit!");

    try {
        const { image, description, bookTitle} = req.body; // Extract data from request body
        console.log(description)
        console.log(bookTitle);

        if (!image) {
            return res.status(400).json({ message: 'No image data provided.' });
        }
        // Create a new image instance
        const newImage = new Image({
            data: image,
            url: "none",
            description: description,
            bookTitle: bookTitle,
            generatedBy: req.user.userId, // Use the user ID from the authenticated user
        });
    
        // Save the image to the database
        await newImage.save();
    
        res.status(201).json({ message: 'Image saved successfully', image: newImage });
    } catch (error) {
        console.error('Error saving image:', error);
        res.status(500).json({ message: 'Failed to save image' });
    }

});

router.post("/get-library", authenticate, async (req, res) => {
    console.log("Image library route hit!");
    try {
        const images = await Image.find({ generatedBy: req.user.userId });
        res.status(200).json(images);
    } catch (error) {
        console.error('Error fetching images:', error);
        res.status(500).json({ message: 'Failed to fetch images' });
    }
});


module.exports = router;