const express = require('express');
const cartController = require('../controllers/cart.c');
const resourceController = require('../controllers/resources.c');
const userController = require('../controllers/user.c');

const router = express.Router();

router.post('/login', userController.login)
router.post('/register', userController.register);
router.put('/subscription',cartController.subscribe)
router.put('/user', userController.update);
router.delete('/user', userController.delete);
router.delete('/user/off', userController.logOut);
router.put('/user/cart', cartController.update);
//router.get('/songs',siteController.searchSite);
//router.get('/songs/:id',siteController.searchSite);

module.exports = router;
