const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

require("dotenv").config();

const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");
const HttpError = require("./models/http-error");

const app = express();

app.use(bodyParser.json());

app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);

app.use((req, res, next) => {
  const error = new HttpError("This page is not available", 404);

  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }

  res.status(error.code || 500);
  res.json({
    message: error.message || "An unkonown error occured!",
  });
});

mongoose
  .connect(
    `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@starting-cluster-01.5mukk.mongodb.net/check_in_places?retryWrites=true&w=majority`
  )
  .then(() =>
    app.listen(5000, () => {
      console.log("Server is connected on PORT: 5000");
    })
  )
  .catch((error) => console.log(error));
