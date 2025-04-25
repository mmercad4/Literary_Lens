const express = require('express');
const Image = require('../models/image');
const router = express.Router();
const authenticate = require('../middleware/auth.js');
const { generateImage } = require('../controllers/imageController');
require('dotenv').config();

router.post('/generate', authenticate, async (req, res) => {
    console.log("Image generation route hit!");
    
    try {
        const { prompt, bookTitle, style } = req.body;
        
        if (!prompt) {
            return res.status(400).json({ message: 'No prompt provided.' });
        }
        
        const result = await generateImage(prompt);
        
        if (!result.success) {
            return res.status(500).json({ message: result.error || 'Failed to generate image' });
        }
        
        // Return only the image data without saving to database
        res.status(200).json({ 
            message: 'Image generated successfully',
            imageData: result.imageData
        });
        
    } catch (error) {
        console.error('Error generating image:', error);
        res.status(500).json({ message: 'Failed to generate image' });
    }
});

router.post('/save', authenticate, async (req, res) => {
    console.log("Image save route hit!");

    try {
        const { image, description, bookTitle, style } = req.body;
        
        console.log("Request received with data:");
        console.log("- Description length:", description ? description.length : 0);
        console.log("- Image data present:", !!image);
        if (image) {
            console.log("- Image data length:", image.length);
        }

        if (!image) {
            return res.status(400).json({ message: 'No image data provided.' });
        }
        
        
        let imageData = image;
        if (typeof image === 'string' && image.startsWith('data:image')) {
            console.log("- Extracting base64 from data URL");
            imageData = image.split(',')[1];
        }
        
        console.log("- Processed image data length:", imageData.length);
        
        // Create a new image instance
        const newImage = new Image({
            data: imageData,
            url: "none",
            description: description || "AI Generated Image",
            bookTitle: bookTitle || "Untitled",
            generatedBy: req.user.userId,
            collection: "Uncategorized",
            style: style || "Default",
        });
    
        console.log("- Saving image to database...");
        
        // Save the image to the database
        await newImage.save();
        
        console.log("- Image saved successfully!");
    
        res.status(201).json({ 
            message: 'Image saved successfully', 
            imageId: newImage._id
        });
    } catch (error) {
        console.error('Error saving image:', error);
        
        // Check for MongoDB document size limit error (16MB)
        if (error.message && error.message.includes('document size')) {
            return res.status(413).json({ 
                message: 'Image is too large for database storage. Please try a smaller image.',
                details: error.message
            });
        }
        
        res.status(500).json({ 
            message: 'Failed to save image',
            details: error.message 
        });
    }
});

router.post("/get-library", authenticate, async (req, res) => {
    console.log("Image library route hit!");
    try {
        const images = await Image.find({ generatedBy: req.user.userId });
        console.log(`Found ${images.length} images for user ${req.user.userId}`);
        res.status(200).json(images);
    } catch (error) {
        console.error('Error fetching images:', error);
        res.status(500).json({ message: 'Failed to fetch images' });
    }
});

router.post("/update-book-title", authenticate, async (req, res) => {
    console.log("Image title update route hit!");
    try {
        const { imageId, bookTitle } = req.body;

        if (!imageId || !bookTitle) {
            return res.status(400).json({ message: 'No image ID or title provided.' });
        }

        // Update the image's title in the database
        const updatedImage = await Image.findByIdAndUpdate(
            imageId, 
            { bookTitle: bookTitle },
            { new: true }
        );

        if (!updatedImage) {
            return res.status(404).json({ message: 'Image not found' });
        }

        res.status(200).json({ 
            message: 'Image title updated successfully',
            image: updatedImage
        });
    } catch (error) {
        console.error('Error updating image title:', error);
        res.status(500).json({ message: 'Failed to update image title' });
    }
});

router.post("/delete-image", authenticate, async (req, res) => {
    console.log("Image delete route hit!");
    try {
        const { imageId } = req.body;

        if (!imageId) {
            return res.status(400).json({ message: 'No image ID provided.' });
        }

        console.log(`Attempting to delete image with ID: ${imageId}`);

        // Find and delete the image from the database
        const deletedImage = await Image.findByIdAndDelete(imageId);
        
        if (!deletedImage) {
            console.log(`Image with ID ${imageId} not found`);
            return res.status(404).json({ message: 'Image not found' });
        }

        console.log(`Successfully deleted image with ID: ${imageId}`);
        res.status(200).json({ message: 'Image deleted successfully' });
    } catch (error) {
        console.error('Error deleting image:', error);
        res.status(500).json({ message: 'Failed to delete image' });
    }
});

module.exports = router;