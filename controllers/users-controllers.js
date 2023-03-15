const { validationResult } = require("express-validator");
const { v4: uuidv4 } = require("uuid");
const HttpError = require("../models/http-error");

const Sample_Users = [
  {
    id: "u1",
    name: "Zakaria Ibrahim",
    email: "zakaria.93@yahoo.com",
    password: "01319321363",
  },
  {
    id: "u2",
    name: "Jamal Hossain",
    email: "jamal_h@abc.com",
    password: "01914655657",
  },
];

const getUsers = (req, res, next) => {
  res.json({ Sample_Users });
};

const signUp = (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    throw new HttpError(
      "Invalid input data, please check your given data!",
      422
    );
  }
  const { name, email, password } = req.body;

  const hasUser = Sample_Users.find((user) => user.email === email);

  if (hasUser) {
    throw new HttpError(
      "There is a registered user with this email already",
      422
    );
  }

  const createdUser = {
    id: uuidv4(),
    name,
    email,
    password,
  };

  Sample_Users.push(createdUser);

  res.status(201).json({ user: createdUser });
};

const logIn = (req, res, next) => {
  const { name, email, password } = req.body;

  const identifiedUser = Sample_Users.find((user) => user.email === email);

  if (!identifiedUser) {
    throw new HttpError("No user exist with this email address", 404);
  }

  if (identifiedUser.password !== password) {
    throw new HttpError("Invalid login credentials", 404);
  }

  res.json({ message: "Successfully logged in ..." });
};

exports.getUsers = getUsers;
exports.signUp = signUp;
exports.logIn = logIn;
