const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator');
const path = require("path");

const errorMiddleware = require("./backend/middleware/error");

app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());

//Route Imports
const user = require("./backend/routes/userRoute");

const content =  require("./backend/routes/contentRoute");

app.use(express.static(path.join(__dirname, "/frontend/build")));


app.use("/api/v1", user);
app.use("/api/v1",content);


app.get("*", (req, res) => {
  res.sendFile(path.resolve("frontend", "build", "index.html"));
});

//Middleware for Error
app.use(errorMiddleware);

module.exports = app;
