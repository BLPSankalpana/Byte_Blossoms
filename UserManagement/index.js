// microservice-a/index.js
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const userRoutes = require('./routes/user'); // Import user routes

const mongoURI = "mongodb+srv://prasadeesankalpana:ZLWLCQTXMvXb3ILq@clustera.fwbeaod.mongodb.net/";

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
  console.log(`Microservice A listening on port ${port}`);
});