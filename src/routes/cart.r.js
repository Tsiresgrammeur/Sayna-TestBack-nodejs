const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.c');

// Update a cart with id
router.put('/:id', cartController.update);


module.exports = router;
