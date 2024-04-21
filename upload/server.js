const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mydatabase');

const conn = mongoose.connection;

// Define a schema for your images
const imageSchema = new mongoose.Schema({
  data: Buffer,
  contentType: String
});

// Create a model based on the schema
const Image = mongoose.model('Image', imageSchema);

// Configure Multer for image uploads
const upload = multer({ dest: 'uploads/' }); // Destination folder for uploaded files

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

// Handle POST request for image upload
app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    // Read the uploaded image file
    const data = req.file.buffer;
    const contentType = req.file.mimetype;

    // Create a new image document
    const image = new Image({
      data: data,
      contentType: contentType
    });

    // Save the image document to the database
    await image.save();

    res.json({ message: 'Image uploaded successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
