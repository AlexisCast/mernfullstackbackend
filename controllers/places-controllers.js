const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const getCoordsForAddress = require("../util/location");
const Place = require("../models/place");

let DUMMY_PLACES = [
	{
		id: "p1",
		title: "Empire State Building",
		description: "One of the most fomous sky scrapper in the world!",
		location: {
			lat: 40.7484474,
			lng: -73.9871516,
		},
		address: "20 W 34th St. New York, NY 10001",
		creator: "u1",
	},
];

const getPlaces = (req, res, next) => {
	res.json({ users: DUMMY_PLACES });
};

const getPlaceById = async (req, res, next) => {
	console.log("GET request in Places");
	const placeId = req.params.pid;

	let place;
	try {
		place = await Place.findById(placeId).exec();
	} catch (err) {
		const error = new HttpError(
			"Something went wrong, could not find a place",
			500
		);
		return next(error);
	}

	if (!place) {
		const error = new HttpError(
			"Could not find a place for the provided id.",
			404
		);
		next(error);
	}
	res.json({ place: place.toObject({ getters: true }) });
};

const getPlacesByUserId = (req, res, next) => {
	const userId = req.params.uid;

	const places = DUMMY_PLACES.filter((p) => {
		return p.creator === userId;
	});
	if (!places || places.length === 0) {
		return next(
			new HttpError(
				"Could not find places for the provided user id.",
				404
			)
		);
	}

	res.json({ places });
};

const createPlace = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		console.log("errors", errors);
		return next(
			new HttpError("Invalid inputs passed, please check your data.", 422)
		);
	}

	const { title, description, address, creator } = req.body;

	let coordinates;
	try {
		coordinates = await getCoordsForAddress(address);
	} catch (error) {
		return next(error);
	}

	const createPlace = new Place({
		title,
		description,
		address,
		location: coordinates,
		image:
			"https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Empire_State_Building_%28aerial_view%29.jpg/400px-Empire_State_Building_%28aerial_view%29.jpg",
		creator,
	});
	try {
		await createPlace.save();
		// DUMMY_PLACES.push(createPlace);
	} catch (err) {
		const error = new HttpError(
			"Creating place failed, please try again.",
			500
		);
	}

	res.status(201).json({ place: createPlace });
};

const updatePlace = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		throw new HttpError(
			"Invalid inputs passed, please check your data.",
			422
		);
	}

	const { title, description } = req.body;
	const placeId = req.params.pid;

	const updatePlace = { ...DUMMY_PLACES.find((p) => p.id === placeId) };
	const placeIndex = DUMMY_PLACES.findIndex((p) => p.id === placeId);
	updatePlace.title = title;
	updatePlace.description = description;

	DUMMY_PLACES[placeIndex] = updatePlace;

	res.status(200).json({ place: updatePlace });
};

const deletePlace = (req, res, next) => {
	const placeId = req.params.pid;
	if (!DUMMY_PLACES.find((p) => p.id === placeId)) {
		throw new HttpError("Could not find a place for that id.", 404);
	}
	DUMMY_PLACES = DUMMY_PLACES.filter((p) => p.id !== placeId);
	res.status(200).json({ message: "Deleted place." });
};

exports.getPlaces = getPlaces;
exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
