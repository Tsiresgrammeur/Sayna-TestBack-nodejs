const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.c');

// Retrieve all users
router.post('/login', userController.login);
// Create a new user
router.post('/register', userController.register);
// Delete a user with id
router.delete('/:id', userController.delete);

module.exports = router;
