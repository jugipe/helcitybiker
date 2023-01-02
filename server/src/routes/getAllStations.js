const db = require("../db/db");

const getAllStations = async (req, res) => {
    const stations = await db.getAllStations();
    res.send(stations.rows);
};

module.exports = getAllStations;