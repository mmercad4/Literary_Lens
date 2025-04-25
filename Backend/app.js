// import modules
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes')
const imageRoutes = require('./routes/imageRoutes');
require('dotenv').config();

// app
const app = express();

// db connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('DB CONNECTED'))
  .catch((err) => console.log('DB CONNECTION ERROR', err));

// middleware - simplify and avoid duplicated middleware
app.use(morgan('dev'));
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Configure body parsers with higher limits first
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// routes
const testRoutes = require('./routes/test');
app.use('/', testRoutes);
app.use('/api/users', userRoutes);
app.use('/api/image', imageRoutes);

// port
const port = process.env.PORT || 8080;

// listener
const server = app.listen(port, () =>
  console.log(`Server is running on port ${port}`)
);