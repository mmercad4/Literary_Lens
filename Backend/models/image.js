const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  data: { type: String, required: true },  // Base64 encoded image data
  url: { type: String, required: true },  // Image file URL
  description: { type: String, required: true },  // Description of the generated image
  bookTitle: { type: String, required: true },  // Book title the image belongs to
  generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // User who generated the image
  public: { type: Boolean, default: false },  // If the image is public
  createdAt: { type: Date, default: Date.now },
});

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;