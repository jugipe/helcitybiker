const db = require("../db/db");

const getStation = async (req, res) => {
    const id = req.params.id;

    // Make an array of all the data, wait for all promises to resolve before returning
    // the data.
    const array = await Promise.all([
        // get the data and process it to better format
        db.getStation(id).then(data => data.rows).then(rows => rows[0]),
        db.getStationDepInfo(id).then(data => data.rows).then(rows => rows[0]),
        db.getStationRetInfo(id).then(data => data.rows).then(rows => rows[0]),
        db.getStationDepTop5Info(id).then(data => data.rows),
        db.getStationRetTop5Info(id).then(data => data.rows),
    ]).catch(err => res.send(404));

    // Wrap the data into an object before sending response
    const wrapped = {
        info: array[0],
        departureStats: array[1],
        returnStats: array[2],
        top5dep: array[3],
        top5ret: array[4]
    }

    res.send(wrapped);
};

module.exports = getStation;