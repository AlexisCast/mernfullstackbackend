const express = require("express");
const { check } = require("express-validator");

const usersController = require("../controllers/users-controllers");

const router = express.Router();

//http://localhost:5000/api/users/p1
router.get("/", usersController.getUsers);

//http://localhost:5000/api/users/signup

router.post(
	"/signup",
	[
		check("name").not().isEmpty(),
		check("email")
			.normalizeEmail() // Test@test.com => test@test.com
			.isEmail(),
		check("password").isLength({ min: 6 }),
	],
	usersController.signup
);

router.post("/login", usersController.login);

module.exports = router;
