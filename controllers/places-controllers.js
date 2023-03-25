const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const Place = require("../models/place");
const User = require("../models/user");
// const getCoordsForAddress = require("../util/location");

let Sample_Places = [
  {
    id: "p1",
    title: "Empire State Building",
    description:
      "One of the most famous sky scrapers in the world! The Empire State Building is a 102-story Art Deco skyscraper in Midtown Manhattan, New York City.",
    imageUrl: "https://media.timeout.com/images/101705309/image.jpg",
    address: "20 W 34th St., New York, NY 10001, United States",
    location: {
      lat: 40.7484474,
      lng: -73.9871516,
    },
    creator: "u1",
  },
  {
    id: "p2",
    title: "Madaripur Sokuni Lake",
    description:
      "Sokuni Lake is a spectacular place in the natural beauty of Madaripur district. It is located at the heart of Madaripur city",
    imageUrl:
      "https://vromonguide.com/wp-content/uploads/madaripur-sokuni-lake.jpg",
    address: "Madaripur Sadar, Madaripur, Dhaka, Bangladesh 7900",
    location: {
      lat: 23.1661525,
      lng: 90.2058498,
    },
    creator: "u2",
  },
  {
    id: "p3",
    title: "Madaripur Sokuni Lake",
    description:
      "Sokuni Lake is a spectacular place in the natural beauty of Madaripur district. It is located at the heart of Madaripur city",
    imageUrl:
      "https://vromonguide.com/wp-content/uploads/madaripur-sokuni-lake.jpg",
    address: "Madaripur Sadar, Madaripur, Dhaka, Bangladesh 7900",
    location: {
      lat: 23.1661525,
      lng: 90.2058498,
    },
    creator: "u3",
  },
];

const getPlaceById = async (req, res, next) => {
  console.log("Get request in places-router!");

  const placeId = req.params.pid;

  let extractedPlace;

  try {
    extractedPlace = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, selected place cannot be loaded",
      500
    );

    return next(error);
  }

  if (!extractedPlace) {
    const error = new HttpError("No place exists for that given Id", 404);

    return next(error);
  }

  res.json({ place: extractedPlace.toObject({ getters: true }) });
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  // let extractedPlace;
  let userWithPlaces;

  try {
    // extractedPlace = await Place.find({ creator: userId });
    userWithPlaces = await User.findById(userId).populate("places");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, fetching places failed for the given user Id",
      500
    );

    console.log(err);

    return next(error);
  }

  // if(!extractedPlace || extractedPlace.length === 0){}
  if (!userWithPlaces || userWithPlaces.places.length === 0) {
    const error = new HttpError("No place exists for that given Id", 404);

    return next(error);
  }

  res.json({
    place: userWithPlaces.places.map((place) =>
      place.toObject({ getters: true })
    ),
  });
};

const createPlace = async (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    next(
      new HttpError("Invalid input data, please check your given data!", 422)
    );
  }

  const { title, description, location, address, creator } = req.body;

  // let coordinates;
  // try {
  //   coordinates = await getCoordsForAddress(address);
  // } catch (error) {
  //   return next(error);
  // }

  const createdPlace = new Place({
    title,
    description,
    location,
    address,
    image: "/images/sample_image.jpg",
    creator,
  });

  let user;
  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError(
      "Creating a new place failed, please try again",
      500
    );
    console.log(err);
    return next(error);
  }

  if (!user) {
    const error = new HttpError(
      "Creating a new place failed, could not find user for provided Id",
      404
    );
    console.log(err);
    return next(error);
  }

  console.log(user);

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    user.places.push(createdPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Creating a new place failed, please try again",
      500
    );
    console.log(err);
    return next(error);
  }

  res.status(201).json({ place: createdPlace });
};

const updatePlace = async (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    return next(
      new HttpError("Invalid input data, please check your given data!", 422)
    );
  }
  const { title, description } = req.body;

  const placeId = req.params.pid;

  let placeToUpdate;

  try {
    placeToUpdate = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, selected place cannot be updated",
      500
    );

    return next(error);
  }

  if (!placeToUpdate) {
    const error = new HttpError("No place exists for that given Id", 404);

    return next(error);
  }

  placeToUpdate.title = title;
  placeToUpdate.description = description;

  try {
    await placeToUpdate.save();
  } catch (err) {
    const error = new HttpError(
      "Updating the selected place failed, please try again",
      500
    );
    console.log(err);
    return next(error);
  }

  res.status(200).json({ place: placeToUpdate.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;

  let placeToDelete;

  try {
    placeToDelete = await Place.findById(placeId).populate("creator");
    // await Place.deleteOne({ _id: placeId });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, selected place cannot be deleted",
      500
    );

    console.log(err);

    return next(error);
  }

  if (!placeToDelete) {
    const error = new HttpError("Selected place does not exist", 404);

    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await placeToDelete.remove({ session: sess });
    placeToDelete.creator.places.pull(placeToDelete);
    await placeToDelete.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Removing the selected place failed, please try again later",
      500
    );
    console.log(err);
    return next(error);
  }

  res.status(200).json({ message: "Selected place has been deleted..." });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
