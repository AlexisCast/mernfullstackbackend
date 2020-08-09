const express = require("express");

const HttpError = require("../models/http-error");

const router = express.Router();

const DUMMY_PLACES = [
	{
		id: "p1",
		title: "Empire State Building",
		description: "One of the most fomous sky scrapper in the world!",
		location: {
			lat: 40.7484474,
			lng: -73.9871516,
		},
		addres: "20 W 34th St. New York, NY 10001",
		creator: "u1",
	},
];

//http://localhost:5000/api/places/p1
router.get("/:pid", (req, res, next) => {
	console.log("GET request in Places");
	const placeId = req.params.pid;
	const place = DUMMY_PLACES.find((p) => {
		return p.id === placeId;
	});
	// if (!place) {
	// 	return res
	// 		.status(404)
	// 		.json({ message: "Could not find a place for the provided id" });
	// }

	// if (!place) {
	// 	const error = new Error("Could not find a place for the provided id.");
	// 	error.code = 404;
	// 	throw error;
	// }

	if (!place) {
		throw new HttpError("Could not find a place for the provided id.", 404);
	}
	res.json({ place: place });
});

//http://localhost:5000/api/places/user/u1
router.get("/user/:uid", (req, res, next) => {
	const userId = req.params.uid;

	const place = DUMMY_PLACES.find((p) => {
		return p.creator === userId;
	});
	// if (!place) {
	// 	return res
	// 		.status(404)
	// 		.json({ message: "Could not find a place for the provided id" });
	// }

	// if (!place) {
	// 	const error = new Error(
	// 		"Could not find a place for the provided user id."
	// 	);
	// 	error.code = 404;
	// 	return next(error);
	// }

	if (!place) {
		return next(
			new HttpError(
				"Could not find a place for the provided user id.",
				404
			)
		);
	}

	res.json({ place });
});

module.exports = router;
