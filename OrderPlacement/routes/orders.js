const express = require('express');
const router = express.Router();
const db = require('../db');

// Create an order
router.post('/orders', (req, res) => {
    const { product, quantity,userId } = req.body;
  
    db.insert({ product, quantity,userId }).into('orders')
      .then((result) => {
        res.status(201).json({ message: 'Order created successfully', orderId: result[0] });
      })
      .catch((err) => {
        console.error('Error creating order:', err);
        res.status(500).json({ error: 'An error occurred' });
      });
  });
  

// Read all orders
router.get('/orders', (req, res) => {
    db.select('*').from('orders')
      .then((results) => {
        res.json(results);
      })
      .catch((err) => {
        console.error('Error fetching orders:', err);
        res.status(500).json({ error: 'An error occurred' });
      });
  });
  

// Update an order by ID
router.put('/orders/:id', (req, res) => {
    const orderId = req.params.id;
    const { product, quantity } = req.body;
  
    db('orders')
      .where('id', orderId)
      .update({ product, quantity })
      .then(() => {
        res.json({ message: 'Order updated successfully' });
      })
      .catch((err) => {
        console.error('Error updating order:', err);
        res.status(500).json({ error: 'An error occurred' });
      });
  });
  

// Delete an order by ID
router.delete('/orders/:id', (req, res) => {
    const orderId = req.params.id;
  
    db('orders')
      .where('id', orderId)
      .del()
      .then(() => {
        res.json({ message: 'Order deleted successfully' });
      })
      .catch((err) => {
        console.error('Error deleting order:', err);
        res.status(500).json({ error: 'An error occurred' });
      });
  });
  

module.exports = router;
