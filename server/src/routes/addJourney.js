const db = require("../db/db");

/**
 * Basic POST endpoint for adding journeys to db
 * Accepts JSON a json object with values for example:
    {
        "id": 13,
        "departure": "2021-07-31T17:59:59.000Z",
        "return": "2021-07-31T18:09:15.000Z",
        "departure_id": 113,
        "departure_name": "Pasilan asema",
        "return_id": 78,
        "return_name": "Messeniuksenkatu",
        "distance": 1602,
        "duration": 553
    }
 */
const addJourney = async (req, res) => {
    const params = Object.values(req.body)

    await db.addJourney(...params)
        .then(data => res.send(data.rows))
        .catch(err => res.send(err))
};

module.exports = addJourney;