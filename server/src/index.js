require("dotenv").config({ path: "../.env" })
const express = require("express");
const cors = require("cors")
const db = require("./db/db")

const getAllStations = require("./routes/getAllStations");

const app = express();
const port =  process.env.API_PORT || 9001;

//middleware services
app.use(cors());
app.use(express.json());

//Routes
app.get("/stations", getAllStations);

db.init().then(() => {
    app.listen(port, () => {console.log("helcitybiker is running @ "+port)});
}).catch((err) => {
    console.log(err);
});