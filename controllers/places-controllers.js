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

const getPlacesByUserId = async (req, res, next) => {
	const userId = req.params.uid;

	let places;
	try {
		places = await Place.find({ creator: userId }).exec();
	} catch (err) {
		const error = new HttpError(
			"Fetching places failed, please try again later",
			500
		);
		return next(error);
	}

	if (!places || places.length === 0) {
		return next(
			new HttpError(
				"Could not find places for the provided user id.",
				404
			)
		);
	}

	res.json({
		places: places.map((place) => place.toObject({ getters: true })),
	});
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

const updatePlace = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		throw new HttpError(
			"Invalid inputs passed, please check your data.",
			422
		);
	}

	const { title, description } = req.body;
	const placeId = req.params.pid;

	let place;
	try {
		place = await Place.findById(placeId);
	} catch (err) {
		const error = new HttpError(
			"Something went wrong, could not update place.",
			500
		);
		return next(error);
	}

	place.title = title;
	place.description = description;

	try {
		await place.save();
	} catch (err) {
		const error = new HttpError(
			"Something went wrong, could not update place.",
			500
		);
		return next(error);
	}
	res.status(200).json({ place: place.toObject({ getters: true }) });
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
