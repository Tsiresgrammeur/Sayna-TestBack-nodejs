const express = require('express');
const router = express.Router();

const resourcesController = require('../controllers/resources.c');

// Retrieve all resources songs
router.get('/songs', resourcesController.findAllSongs);
// Retrieve one resource song
router.get('/songs/:id', resourcesController.findSong);
// Retrieve all resources bills
router.get('/bills', resourcesController.findAllBills);


module.exports = router;