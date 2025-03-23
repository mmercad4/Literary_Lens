const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  genre: { type: String },
  images: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Image' }],
});

const Book = mongoose.model('Book', bookSchema);
