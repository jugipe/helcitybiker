const db = require("../db/db");

const getJourneys = async (req, res) => {
    const offset = req.query.offset;
    const limit = req.query.limit;

    const array = await Promise.all([
        db.getJourneys(offset, limit).then(data => data.rows),
        db.getJourneyCount().then(data => data.rows).then(rows => rows[0])
    ])

    // Wrap the data to object for easier maintenance in frontend and send the response
    const wrapped = {
        journeys: array[0],
        total: array[1].total
    }

    res.send(wrapped);
};

module.exports = getJourneys;