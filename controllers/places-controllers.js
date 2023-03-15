const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");

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

const getPlaceById = (req, res, next) => {
  console.log("Get request in places-router!");

  const placeId = req.params.pid;

  const place = Sample_Places.find((place) => place.id === placeId);

  if (!place) {
    throw new HttpError("There is no place found for that given Id", 404);
  }

  res.json({ place });
};

const getPlacesByUserId = (req, res, next) => {
  const userId = req.params.uid;

  const places = Sample_Places.filter((place) => place.creator === userId);

  if (!places || places.length === 0) {
    const error = new HttpError(
      "There is no place found for that given Id",
      404
    );
    return next(error);
  }

  res.json({ places });
};

const createPlace = (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    throw new HttpError(
      "Invalid input data, please check your given data!",
      422
    );
  }

  const { title, description, coordinates, address, creator } = req.body;

  const createdPlace = {
    id: uuidv4(),
    title,
    description,
    location: coordinates,
    address,
    creator,
  };

  Sample_Places.push(createdPlace);

  res.status(201).json({ place: createdPlace });
};

const updatePlace = (req, res, nex) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    throw new HttpError(
      "Invalid input data, please check your given data!",
      422
    );
  }
  const { title, description } = req.body;

  const placeId = req.params.pid;

  const updatedPlace = {
    ...Sample_Places.find((place) => place.id === placeId),
  };
  const placeIndex = Sample_Places.findIndex((place) => place.id === placeId);
  updatedPlace.title = title;
  updatedPlace.description = description;

  Sample_Places[placeIndex] = updatedPlace;

  res.status(200).json({ place: updatedPlace });
};

const deletePlace = (req, res, nex) => {
  const placeId = req.params.pid;

  if (!Sample_Places.find((place) => place.id === placeId)) {
    throw new HttpError("There is no place found for that given Id", 404);
  }

  Sample_Places = Sample_Places.filter((place) => place.id !== placeId);

  res.status(200).json({ message: "Selected place has been deleted..." });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
