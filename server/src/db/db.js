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
            'departure DATE, return DATE, departure_id INT, departure_name VARCHAR(50),'+ 
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

        console.log("Connected to postgresql @ "+host+":"+port);
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
        pool.query("SELECT * FROM stations", (err, data) => {
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
            if(err) return rej(err);
            acc(data);
        })
    })
}

module.exports = { init, pool, disconnect, getAllStations, getJourneys, getStation};