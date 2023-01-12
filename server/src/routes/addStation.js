const db = require("../db/db");

/**
 * Basic POST endpoint for adding stations to db
 * Accepts JSON a json object with values for example:
    {
        "fid": 1,
        "id": 100,
        "nimi": "Uusi asema",
        "namn": "Ny station",
        "name": "New station",
        "osoite": "Asemakatu 1",
        "address": "Stationsgatan 1",
        "kaupunki": "Helsinki",
        "stad": "Helsingfors",
        "operaattori": "City Bike Finland",
        "kapasiteetti": 10,
        "location_x": "23.7587167",
        "location_y": "61.4981489"
    }
 */
const addStation = async (req, res) => {
    
    const params = Object.values(req.body);

    await db.addStation(...params)
        .then(data => res.send(data.rows))
        .catch(err => res.send(err))

};

module.exports = addStation;