const express = require("express");
const { check } = require("express-validator");

const placesControllers = require("../controllers/places-controllers");
const fileUpload = require('../middleware/file-upload');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.get("/", placesControllers.getPlaces);

//http://localhost:5000/api/places/p1
router.get("/:pid", placesControllers.getPlaceById);

//http://localhost:5000/api/places/user/u1
router.get("/user/:uid", placesControllers.getPlacesByUserId);

router.use(checkAuth);

//http://localhost:5000/api/places
router.post(
	"/",
	fileUpload.single('image'),
	[
		check("title").not().isEmpty(),
		check("description").isLength({ min: 5 }),
		check("address").not().isEmpty(),
	],
	placesControllers.createPlace
);

//http://localhost:5000/api/places/p1
router.patch(
	"/:pid",
	[
        check("title").not().isEmpty(), 
        check("description").isLength({ min: 5 }),
    ],
	placesControllers.updatePlace
);

router.delete("/:pid", placesControllers.deletePlace);

module.exports = router;
