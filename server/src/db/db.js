const Pool = require("pg").Pool;
const waitPort = require("wait-port");
const copyFrom = require("pg-copy-streams").from;
const fs = require("fs");

let pool;

async function init() {
        const user = process.env.DB_USER || "postgres";
        const password = process.env.DB_PW || "postgres";
        const host = process.env.DB_HOST || "localhost";
        const database = process.env.DB || "postgres";
        const port = process.env.DB_PORT || 5432;

        await waitPort({
            host,
            port: parseInt(port),
            timeout: 10000,
            waitForDns: true,
        });

        pool = new Pool({
            user,
            password,
            host,
            database
        });
        return "--Pool created--";
}

async function createDbTablesIfNotExists(){
    return Promise.all([
        new Promise((res, rej) => {
            pool.query(
                'CREATE TABLE IF NOT EXISTS raw_journeys (id SERIAL PRIMARY KEY,'+
                'departure TIMESTAMP NOT NULL, return TIMESTAMP NOT NULL, departure_id INT NOT NULL, departure_name VARCHAR(50) NOT NULL,'+ 
                'return_id INT NOT NULL, return_name VARCHAR(50) NOT NULL, distance DOUBLE PRECISION, duration INT)', 
                err => {
                    if(err) rej(err.message);
                    res("raw_journeys created")
                })
        }),
        new Promise((res, rej) => {
            pool.query(
            'CREATE TABLE IF NOT EXISTS raw_stations (fid INT PRIMARY KEY NOT NULL, id INT NOT NULL, nimi VARCHAR(50) NOT NULL,'+
            'namn VARCHAR(50), name VARCHAR(50), osoite VARCHAR(50) NOT NULL,'+
            'address VARCHAR(50) NOT NULL, kaupunki VARCHAR(20), stad VARCHAR(20), Operaattori VARCHAR(50), Kapasiteetti INT,'+
            'location_x VARCHAR(50), location_y VARCHAR(50))',
            err => {
                if(err) rej(err.message);
                res("raw_stations created")
            })
        })
    ]).then(() => {return("--Tables created--")})
}

function makeViews(){
    return Promise.all([
        new Promise((res, rej) => {
            // Make a view that excludes too short journeys from raw_data. That way we keep all the data if we need it later.    
            pool.query('CREATE OR REPLACE VIEW journeys AS SELECT * FROM raw_journeys WHERE '+
            'distance > 9 AND distance is not null AND duration > 9 AND duration is not null', err => {
                if(err) rej(err.message);
                res("jorneys view created")
            })
        }),
        new Promise((res, rej) => {
        // Add all station data to the stations view
        pool.query('CREATE OR REPLACE VIEW stations AS SELECT * FROM raw_stations', (err, succ) => {
                if(err) rej(err.message);
                res("stations view created")
            })
        })
    ]).then(() => {return("--Views created--")})
}

    // Update the stations to have "Helsinki, Helsingfors, CityBike Finland" to all Helsinki stations missing the
    // kaupunki, stad, operaattori data. 
function updateStationsWithCity(){
    return new Promise((res, rej) => {
        pool.query('UPDATE raw_stations SET kaupunki = $1, stad = $2, operaattori = $3 WHERE kaupunki = $4', ["Helsinki", "Helsingfors", "CityBike Finland", " "], (err, succ) => {
            if(err) return rej(err.message);
            res("--Stations table updated--")
        });
    });
}

    // Disconnect all clients from the pool
function disconnect() {
    return new Promise((res, rej) => {
        pool.end(err => {
            if (err) rej(err.message);
            else res();
        });
    });
}

function getAllStations() {
    return new Promise((res, rej) => {
        pool.query("SELECT * FROM stations ORDER BY fid ASC", (err, data) => {
            if(err) {rej(err.message)};
            res(data);
        });
    });
}

async function getJourneys(offset, limit) {
    return new Promise((res, rej) => {
        pool.query("SELECT * FROM journeys ORDER BY id ASC OFFSET $1 LIMIT $2", [offset, limit], (err, data) => {
            if(err) rej(err.message);
            res(data);
        });
    });
}

async function getJourneyCount(){
    return new Promise((res, rej) => {
        pool.query("SELECT COUNT(*) AS total FROM journeys", (err, data) => {
            if(err) rej(err.message);
            res(data);
        });
    });
}

async function getStation(id) {
    return new Promise((res, rej) => {
        pool.query("SELECT * FROM stations WHERE id= $1",[id],(err, data) => {
            if(err) {rej(err.message)};
            res(data);
        });
    });
}

async function addStation(fid, id, nimi, namn, name, osoite, address, kaupunki, stad, operaattori, kapasiteetti, x, y){
    return new Promise((acc, rej) => {
        pool.query("INSERT INTO raw_stations(fid, id, nimi, namn, name, osoite, address, kaupunki, stad,"+
         "operaattori, kapasiteetti, location_x, location_y) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *", 
         [fid, id, nimi, namn, name, osoite, address, kaupunki, stad, operaattori, kapasiteetti, x, y], (err, data) => {
            if(err) {rej(err.message)};
            acc(data);
         });
    });
}
async function addJourney(departure_time, return_time, dep_station_id, dep_station_name, ret_station_id, ret_station_name, distance, duration){
    return new Promise((acc, rej) => {
        pool.query("INSERT INTO raw_journeys(id, departure, return, departure_id, departure_name, return_id, return_name, distance, duration)"+
        "VALUES(DEFAULT, $1, $2, $3, $4, $5, $6, $7, $8) RETURNING *", [departure_time, return_time, dep_station_id, dep_station_name, ret_station_id, 
            ret_station_name, distance, duration], (err, data) => {
                if(err) rej(err.message);
                acc(data);
            });    
    });
}

async function getStationDepInfo(id) {
    return new Promise((res, rej) => {
        pool.query("SELECT COUNT(return_name) AS departures, AVG(distance) AS avg_dep_dist FROM journeys "+
        "WHERE departure_id= $1",[id],(err, data) => {
            if(err) {rej(err.message)};
            res(data);
        });
    });
}

async function getStationRetInfo(id) {
    return new Promise((res, rej) => {
        pool.query("SELECT COUNT(departure_name) AS returns, AVG(distance) AS avg_ret_dist FROM journeys "+
        "WHERE return_id=$1",[id],(err, data) => {
            if(err) {rej(err.message)};
            res(data);
        });
    });
}

async function getStationRetTop5Info(id) {
    return new Promise((res, rej) => {
        pool.query("SELECT return_name, return_id, COUNT(return_name) as top_5_dep FROM journeys WHERE departure_id = $1 "+
        "GROUP BY return_name, return_id ORDER BY top_5_dep DESC LIMIT 5",[id],(err, data) => {
            if(err) {return rej(err.message)};
            res(data);
        });
    });
}

async function getStationDepTop5Info(id) {
    return new Promise((res, rej) => {
        pool.query("SELECT departure_name, departure_id, COUNT(departure_name) as top_5_ret FROM journeys WHERE return_id = $1 "+
        "GROUP BY departure_name, departure_id ORDER BY top_5_ret DESC LIMIT 5",[id],(err, data) => {
            if(err) {rej(err.message)};
            res(data);
        });
    });
}

async function truncateTable(tableName){
    return new Promise((res, rej) => {
        pool.query("TRUNCATE "+tableName+" RESTART IDENTITY", err => {
            if(err) {rej(err.message)};
            res();
        });
    });
}

async function addCSVtoTable(tableName, fileName){
    let params = "";
    if(tableName === "journeys"){

        // If we are reading the stream to journeys we need to give the params, because of serialization of id in journey table, 
        // otherwise query thinks departure is id
        params = "(departure, return, departure_id, departure_name, return_id, return_name, distance, duration)";
    }
    return new Promise((res, rej) => {
        pool.connect((error, client, done) => {
            const stream = client.query(copyFrom("COPY raw_"+tableName+params+" FROM STDIN CSV HEADER"));
            const filestream = fs.createReadStream(fileName);
            filestream.on("error", done);
            stream.on("error", done);
            stream.on("finish", done => res("done reading file -> "+fileName+" to database"));
            filestream.pipe(stream);
            if(error) {rej(error.message)};
        });      
    });
}

module.exports = { init, createDbTablesIfNotExists, disconnect, 
                getAllStations, getJourneys, getStation,
                truncateTable, addCSVtoTable, makeViews, 
                updateStationsWithCity, getStationDepInfo,
                getStationRetInfo, getStationDepTop5Info,
                getStationRetTop5Info, getJourneyCount,
                addStation, addJourney };