const express = require("express");

const userssControllers = require("../controllers/users-controllers");

const router = express.Router();

router.get("/", userssControllers.getUsers);

router.post("/signup", userssControllers.signUp);

router.post("/login", userssControllers.logIn);

module.exports = router;
