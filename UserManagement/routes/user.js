
const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Create user
router.post('/users', async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Retrieve user by ID
router.get('/users/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) throw new Error('User not found');
    res.json(user);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Update user by ID
router.put('/users/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const updatedUserData = req.body;

    const updatedUser = await User.findByIdAndUpdate(userId, updatedUserData, {
      new: true, 
    });

    if (!updatedUser) {
      throw new Error('User not found');
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete user by ID
router.delete('/users/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      throw new Error('User not found');
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


module.exports = router;