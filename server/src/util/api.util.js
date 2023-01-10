const path = require("path");
const db = require("../db/db")
const populateDB = require("./populateDB");


// A promise chain to run everything on startup
// Values are the returns of the promise, which we print to know which step is going on
const launch = (app, port) => {
    db.init()
        .then((value) => console.log(value))
        .then(() => db.createDbTablesIfNotExists())
        .then((value) => console.log(value))
        .then(() => { 
                        if(process.env.NODE_ENV_POPULATE === "true"){
                            return populateDB(path.resolve("./src/files")+"/");
                        } else {
                            return Promise.resolve("--No populate--");
                        }                     
                    })
        .then((value) => console.log(value))
        .then(() =>  db.makeViews())
        .then((value) => console.log(value))
        .then(() =>  db.updateStationsWithCity())
        .then((value) => console.log(value))
        .then(() => app.listen(port, () => {console.log("helcitybiker is running @ "+port); app.emit("started")}))
        .catch((err) => {
            console.log(err.message);
    });
};

// disconnect the db and exit the process
const shutdown = () => {
    db.disconnect()
        .catch(() => {})
        .then(() => process.exit());
};

module.exports = { launch, shutdown }