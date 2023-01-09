const db = require("../db/db");

const getJourneys = async (req, res) => {
    const offset = req.query.offset;
    const limit = req.query.limit;
    const journeys = await Promise.all([
        db.getJourneys(offset, limit).then(data => data.rows),
        db.getJourneyCount().then(data => data.rows).then(rows => rows[0])
    ]);
    res.send(journeys);
};

module.exports = getJourneys;