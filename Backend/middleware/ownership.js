const Image = require('../models/image');

const checkOwnership = async (req, res, next) => {
    console.log("Ownership check middleware hit!");
    try {
        const { imageId } = req.body;

        if (!imageId) {
            return res.status(400).json({ message: 'No image ID provided.' });
        }

        // Find the image by ID
        const image = await Image.findById(imageId);
        if (!image) {
            return res.status(404).json({ message: 'Image not found.' });
        }

        // Check if the authenticated user is the owner
        if (image.generatedBy.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'You are not authorized to perform this action.' });
        }

        // Attach the image to the request object for further use
        req.image = image;

        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error('Error checking ownership:', error);
        res.status(500).json({ message: 'Failed to verify ownership.' });
    }
};

module.exports = checkOwnership;