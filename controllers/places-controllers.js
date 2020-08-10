const { v4: uuidv4 } = require("uuid");

const HttpError = require("../models/http-error");

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

const getPlaceById = (req, res, next) => {
	console.log("GET request in Places");
	const placeId = req.params.pid;
	const place = DUMMY_PLACES.find((p) => {
		return p.id === placeId;
	});

	if (!place) {
		throw new HttpError("Could not find a place for the provided id.", 404);
	}
	res.json({ place: place });
};

const getPlaceByUserId = (req, res, next) => {
	const userId = req.params.uid;

	const place = DUMMY_PLACES.find((p) => {
		return p.creator === userId;
	});
	if (!place) {
		return next(
			new HttpError(
				"Could not find a place for the provided user id.",
				404
			)
		);
	}

	res.json({ place });
};

const createPlace = (req, res, next) => {
	const { title, description, coordinates, addres, creator } = req.body;
	const createPlace = {
		id: uuidv4(),
		title,
		description,
		location: coordinates,
		addres,
		creator,
	};
	DUMMY_PLACES.push(createPlace);
	res.status(201).json({ place: createPlace });
};

const updatePlace = (req, res, next) => {
	const { title, description } = req.body;
	const placeId = req.params.pid;

	const updatePlace = { ...DUMMY_PLACES.find((p) => p.id === placeId) };
	const placeIndex = DUMMY_PLACES.findIndex((p) => p.id === placeId);
	updatePlace.title = title;
	updatePlace.description = description;

	DUMMY_PLACES[placeIndex] = updatePlace;

	res.status(200).json({ place: updatePlace });
};

const deletePlace = (req, res, next) => {};

exports.getPlaceById = getPlaceById;
exports.getPlaceByUserId = getPlaceByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
