const db = require("../db/db");

const getStation = async (req, res) => {
    const name = req.params.name;

    // Make an array of all the data, wait for all promises to resolve before returning
    // the data.
    const array = await Promise.all([
        // get the data and process it to better format
        db.getStation(name).then(data => data.rows).then(rows => rows[0]),
        db.getStationDepInfo(name).then(data => data.rows).then(rows => rows[0]),
        db.getStationRetInfo(name).then(data => data.rows).then(rows => rows[0]),
        db.getStationDepTop5Info(name).then(data => data.rows),
        db.getStationRetTop5Info(name).then(data => data.rows),
    ]);

    res.send(array);
};

module.exports = getStation;