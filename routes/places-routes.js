const express = require("express");

const placesControllers = require("../controllers/places-controllers");

const router = express.Router();

//http://localhost:5000/api/places/p1
router.get("/:pid", placesControllers.getPlaceById);

//http://localhost:5000/api/places/user/u1
router.get("/user/:uid", placesControllers.getPlaceByUserId);

router.post("/", placesControllers.createPlace);

router.patch("/:pid", placesControllers.updatePlace);

router.delete("/:pid", placesControllers.deletePlace);

module.exports = router;
