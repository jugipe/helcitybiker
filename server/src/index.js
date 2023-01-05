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
app.get("/stations/:name", getStation);
app.get("*", get404);

db.init().then(() => {

    // populate the db depending on .env variable
    if(process.env.NODE_ENV_POPULATE === "true"){
        populateDB(path.join(__dirname, "/files/"))
    }

    app.listen(port, () => {console.log("helcitybiker is running @ "+port)});
}).catch((err) => {
    console.log(err);
});
