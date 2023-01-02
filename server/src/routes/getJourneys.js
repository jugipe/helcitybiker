const db = require("../db/db");

const getJourneys = async (req, res) => {
    const journeys = await db.getJourneys();
    res.send(journeys.rows);
};

module.exports = getJourneys;