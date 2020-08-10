const express = require("express");

const usersController = require('../controllers/users-controllers');

const router = express.Router();

//http://localhost:5000/api/users/p1
router.get('/', usersController.getUsers);

//http://localhost:5000/api/users/signup
router.post('/signup', usersController.signup);

router.post('/login', usersController.login);

module.exports = router;
