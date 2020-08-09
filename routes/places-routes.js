const express = require("express");

const placesControllers = require("../controllers/places-controllers");

const router = express.Router();

//http://localhost:5000/api/places/p1
router.get("/:pid",placesControllers.getPlaceById);

//http://localhost:5000/api/places/user/u1
router.get("/user/:uid",placesControllers.getPlaceByUserId);

router.post('/',placesControllers.createPlace);

module.exports = router;
