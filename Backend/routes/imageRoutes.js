const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Image = require('../models/image'); // Import the Image model
const router = express.Router();
const authenticate = require('../middleware/auth.js');
const checkOwnership = require('../middleware/ownership.js');

// Post route for image saving
router.post('/save', authenticate, async (req, res) => {
    console.log("Image save route hit!");

    try {
        const { image, description, bookTitle, style} = req.body; // Extract data from request body

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
            collection: "Uncategorized",
            style: style,
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

router.post("/delete-image", authenticate, checkOwnership, async (req, res) => {
    console.log("Image delete route hit!");
    try {
        const { imageId } = req.body; // Extract image ID from request body

        if (!imageId) {
            return res.status(400).json({ message: 'No image ID provided.' });
        }

        // Delete the image from the database
        await Image.findByIdAndDelete(imageId);

        res.status(200).json({ message: 'Image deleted successfully' });
    } catch (error) {
        console.error('Error deleting image:', error);
        res.status(500).json({ message: 'Failed to delete image' });
    }
});

router.post("/update-collection", authenticate, checkOwnership, async (req, res) => {
    console.log("Image collection update route hit!");
    try {
        const { imageId, collection } = req.body; // Extract image ID and collection from request body
        if (!imageId || !collection) {
            return res.status(400).json({ message: 'No image ID or collection provided.' });
        }

        // Update the image's collection in the database
        await Image.findByIdAndUpdate(imageId, { collection: collection });

        res.status(200).json({ message: 'Image collection updated successfully' });
    } catch (error) {
        console.error('Error updating image collection:', error);
        res.status(500).json({ message: 'Failed to update image collection' });
    }
});

router.post("/update-book-title", authenticate, checkOwnership, async (req, res) => {
    console.log("Image book title update route hit!");
    try {
        const { imageId, bookTitle } = req.body; // Extract image ID and book title from request body

        if (!imageId || !bookTitle) {
            return res.status(400).json({ message: 'No image ID or book title provided.' });
        }

        // Update the image's book title in the database
        await Image.findByIdAndUpdate(imageId, { bookTitle: bookTitle });

        res.status(200).json({ message: 'Image book title updated successfully' });
    } catch (error) {
        console.error('Error updating image book title:', error);
        res.status(500).json({ message: 'Failed to update image book title' });
    }
});

router.post("/update-public", authenticate, checkOwnership, async (req, res) => {
    console.log("Image public update route hit!");
    try {
        const { imageId, publicStatus } = req.body; // Extract image ID and public status from request body

        if (!imageId || publicStatus === undefined) {
            return res.status(400).json({ message: 'No image ID or public status provided.' });
        }

        // Update the image's public status in the database
        await Image.findByIdAndUpdate(imageId, { public: publicStatus });

        res.status(200).json({ message: 'Image public status updated successfully' });
    } catch (error) {
        console.error('Error updating image public status:', error);
        res.status(500).json({ message: 'Failed to update image public status' });
    }
});

router.post("/get-public-images-search", authenticate, async (req, res) => {
    console.log("Public image library route hit!");
    const { searchTerm } = req.body; // Extract search term from request body
    try {
        const images = await Image.find({ public: true, collection: { $regex: searchTerm, $options: 'i' } });
        res.status(200).json(images);
    } catch (error) {
        console.error('Error fetching public images:', error);
        res.status(500).json({ message: 'Failed to fetch public images' });
    }
});

module.exports = router;