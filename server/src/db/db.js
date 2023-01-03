const Pool = require("pg").Pool;
const waitPort = require("wait-port")

let pool;

async function init() {
    const user = process.env.DB_USER || "postgres";
    const password = process.env.DB_PW || "secret";
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

    return new Promise((acc, rej) => {
        pool.query(
            'CREATE TABLE IF NOT EXISTS journeys (id SERIAL PRIMARY KEY,'+
            'departure TIMESTAMP, return TIMESTAMP, departure_id INT, departure_name VARCHAR(50),'+ 
            'return_id INT, return_name VARCHAR(50), distance INT, duration INT)', 
            err => {
                if(err) return rej(err);
            });
        pool.query(
            'CREATE TABLE IF NOT EXISTS stations (fid INT PRIMARY KEY, id INT, nimi VARCHAR(50)'+
            'UNIQUE, namn VARCHAR(50) UNIQUE, name VARCHAR(50) UNIQUE, osoite VARCHAR(50),'+
            'address VARCHAR(50), kaupunki VARCHAR(20), stad VARCHAR(20), Operaattori VARCHAR(50), Kapasiteetti INT,'+
            'location_x VARCHAR(50), location_y VARCHAR(50))',
            err => {
                if(err) return rej(err);
            });
        acc();
    });
}

async function disconnect() {
    return new Promise((acc, rej) => {
        pool.end(err => {
            if (err) rej(err);
            else acc();
        });
    });
}

async function getAllStations() {
    return new Promise((acc, rej) => {
        pool.query("SELECT * FROM stations ORDER BY fid ASC", (err, data) => {
            if(err) return rej(err);
            acc(data);
        })
    })
}

async function getJourneys() {
    return new Promise((acc, rej) => {
        pool.query("SELECT * FROM journeys", (err, data) => {
            if(err) return rej(err);
            acc(data);
        })
    })
}

async function getStation(name) {
    return new Promise((acc, rej) => {
        pool.query("SELECT * FROM stations WHERE name= $1",[name],(err, data) => {
            if(err) {console.log(err); return rej(err)};
            acc(data);
        })
    })
}

async function addStation(fid, id, nimi, namn, name, osoite, address, kaupunki, stad, operaattori, kapasiteetti, x, y){
    return new Promise((acc, rej) => {
        pool.query("INSERT INTO stations(fid, id, nimi, namn, name, osoite, address, kaupunki, stad,"+
         "operaattori, kapasiteetti, location_x, location_y) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)", 
         [fid, id, nimi, namn, name, osoite, address, kaupunki, stad, operaattori, kapasiteetti, x, y], err => {
            if(err) {console.log(err); return rej(err)};
         });
         acc();
    });
}

async function addJourney(departure_time, return_time, dep_station_id, dep_station_name, ret_station_id, ret_station_name, distance, duration){
    return new Promise((acc, rej) => {
        pool.query("INSERT INTO journeys(id, departure, return, departure_id, departure_name, return_id, return_name, distance, duration)"+
        "VALUES(DEFAULT, $1, $2, $3, $4, $5, $6, $7, $8)", [departure_time, return_time, dep_station_id, dep_station_name, ret_station_id, 
            ret_station_name, distance, duration], err => {
                if(err) return rej(err);
            });
            acc();
    });
}

async function truncateTable(tableName){
    return new Promise((acc, rej) => {
        pool.query("TRUNCATE "+tableName+" RESTART IDENTITY", err => {
            if(err) {console.log(err); return rej(err)};
        });
        acc();
    });
}

module.exports = { init, pool, disconnect, getAllStations, getJourneys, getStation, addStation, addJourney, truncateTable};