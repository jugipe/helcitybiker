const db = require("../db/db");
const readFiles = require("./CSV-reader");

const populateDB = (dir) => {
    const dirs = ["stationdata", "journeydata"];
    dirs.forEach(folder => {
        readFiles(dir+folder, folder)
    });


}


module.exports = populateDB;