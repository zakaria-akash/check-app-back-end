const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const User = require("../models/user");

// const Sample_Users = [
//   {
//     id: "u1",
//     name: "Zakaria Ibrahim",
//     email: "zakaria.93@yahoo.com",
//     password: "01319321363",
//   },
//   {
//     id: "u2",
//     name: "Jamal Hossain",
//     email: "jamal_h@abc.com",
//     password: "01914655657",
//   },
// ];

const getUsers = async (req, res, next) => {
  let currentUsers;
  try {
    currentUsers = await User.find({}, "-password");
  } catch (err) {
    const error = new HttpError(
      "Fetching user list failed, please try again later",
      500
    );

    return next(error);
  }
  res.json({
    users: currentUsers.map((user) => user.toObject({ getters: true })),
  });
};

const signUp = async (req, res, next) => {
  const Error = validationResult(req);

  if (!Error.isEmpty()) {
    return next(
      new HttpError("Invalid input data, please check your given data!", 422)
    );
  }
  const { name, email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later",
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "There is a registered user with this email already, please login instead",
      422
    );

    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    image: "/images/sample_image.jpg",
    password,
    places: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later",
      500
    );
    return next(error);
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const logIn = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later",
      500
    );
    return next(error);
  }

  if (!existingUser || existingUser.password !== password) {
    const error = new HttpError(
      "Invalid login credentials, please try again later",
      401
    );
    return next(error);
  }

  res.json({
    message: "Successfully logged in ...",
    user: existingUser.toObject({ getters: true }),
  });
};

exports.getUsers = getUsers;
exports.signUp = signUp;
exports.logIn = logIn;
