require("dotenv").config({ path: "../.env."+`${process.env.NODE_ENV}`});
const express = require("express");
const cors = require("cors");
const db = require("./db/db");
const path = require("path");
const populateDB = require("./util/populateDB");

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

// chain functions to start everything on startup
db.init().then(() => {
    
    db.createDbTablesIfNotExists();

    }).then(() => {
    
    if(process.env.NODE_ENV_POPULATE === "true"){

        populateDB(path.join(__dirname, "/files/"));

    }}).then(() => {

        db.makeViews();

    }).then(() => {

        db.updateStationsWithCity();
    
    }).then(() => {

        app.listen(port, () => {console.log("helcitybiker is running @ "+port)});
        app.emit('started');

    }).catch((err) => {
        console.log(err);
});

// disconnect the db and exit the process
const shutdown = () => {
    db.disconnect()
        .catch(() => {})
        .then(() => process.exit());
};

// use shutdown on different process emits
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
process.on('SIGUSR2', shutdown);

module.exports = app;