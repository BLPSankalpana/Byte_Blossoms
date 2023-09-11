
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const userRoutes = require('./routes/user'); // Import user routes


require("dotenv").config({ path: '../.env' }); //env configuration
const mongoURI = process.env.MONGODB_URL;
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.use(express.json());
app.use('/user', userRoutes);

const port = 3001;
app.listen(port, () => {
  console.log(`Microservice A listening on port ${port}`);
});

