const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controllers');

// Retrieve all users
router.get('/users', userController.findAll);

// Create a new user
router.post('/users', userController.create);

// Retrieve a single user with id
router.get('/getLoggedInUserDetails', userController.findOne);

// Update a user with id
router.put('/users', userController.update);

// Delete a user with id
router.delete('/deleteuser', userController.delete);

// login
router.post('/login', userController.login);


module.exports = router