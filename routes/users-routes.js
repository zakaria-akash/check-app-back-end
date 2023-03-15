const express = require("express");

const { check } = require("express-validator");

const userssControllers = require("../controllers/users-controllers");

const router = express.Router();

router.get("/", userssControllers.getUsers);

router.post(
  "/signup",
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  userssControllers.signUp
);

router.post("/login", userssControllers.logIn);

module.exports = router;
