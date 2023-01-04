const db = require("../db/db");

const getStation = async (req, res) => {
    const name = req.params.name;
    const station = await db.getStation(name);
    res.send(station.rows);
};

module.exports = getStation;