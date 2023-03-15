const { v4: uuidv4 } = require("uuid");
const HttpError = require("../models/http-error");

const Sample_Places = [
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
    throw new HttpError("Could not find a place for given id.");
  }

  res.json({ place });
};

const getPlaceByUserId = (req, res, next) => {
  const userId = req.params.uid;

  const place = Sample_Places.find((place) => place.creator === userId);

  if (!place) {
    const error = new HttpError(
      "Could not find a place for given user id.",
      404
    );
    return next(error);
  }

  res.json({ place });
};

const createPlace = (req, res, next) => {
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

exports.getPlaceById = getPlaceById;
exports.getPlaceByUserId = getPlaceByUserId;
exports.createPlace = createPlace;
