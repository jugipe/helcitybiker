require("dotenv").config({ path: "../.env" })
const express = require("express");
const cors = require("cors")

const app = express();
const port =  process.env.API_PORT || 9001;

//middleware services
app.use(cors());
app.use(express.json());

app.listen(port, () => {console.log("helcitybiker is running @ "+port)});