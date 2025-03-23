// import modules
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes')
require('dotenv').config();

// app
const app = express();

// db
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('DB CONNECTED'))
  .catch((err) => console.log('DB CONNECTION ERROR', err));

// middleware
app.use(morgan('dev'));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json())

// routes
const testRoutes = require('./routes/test');
app.use('/', testRoutes);
app.use('/api/users', userRoutes);

// port
const port = process.env.PORT || 8080;

// listener
const server = app.listen(port, () =>
  console.log(`Server is running on port ${port}`)
);
