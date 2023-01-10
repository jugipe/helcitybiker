require("dotenv").config({ path: "../.env."+`${process.env.NODE_ENV}`});
const express = require("express");
const cors = require("cors");
const { launch, shutdown } = require("./util/api.util");

const getAllStations = require("./routes/getAllStations");
const getJourneys = require("./routes/getJourneys");
const getStation = require("./routes/getStation");
const get404 = require("./routes/get404");


const app = express();
const port =  process.env.API_PORT || 9001;

//middleware services
app.use(cors());
app.use(express.json());

//Routes
app.get("/stations", getAllStations);
app.get("/journeys", getJourneys);
app.get("/stations/:id", getStation);
app.get("*", get404);

// launch app with start function
launch(app, port);

// use shutdown on different process emits
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
process.on('SIGUSR2', shutdown);

module.exports = app;