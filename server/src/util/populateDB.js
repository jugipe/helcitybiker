const fs = require("fs")
const path = require("path");
const db = require("../db/db");
const urlParse = require("url");
const https = require("https");

const populateDB = async(dir) => {
    // names of the folders that have the data inside
        const folders = ["stationdata", "journeydata"];

        const tables = ["raw_stations", "raw_journeys"];

        tables.forEach(table => db.truncateTable(table));
        const promiseList = folders.map(folder => {readFiles(dir+folder, folder)})
        return await Promise.all(promiseList).then(() => {return "--Database populated--"});
}

const readFiles = async(dir, dataType) => {
    if(!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true })
    }
    
    const files = fs.readdirSync(dir);

    if(files.length === 0){
        if(dataType === "stationdata"){
            return downloadStationData(dir);
        } else if (dataType === "journeydata"){
            return downloadJourneyData(dir);
        }
    }

    files.forEach(filename => {
        return readCSV(path.resolve(dir, filename), dataType);
    });
}

const readCSV = (filepath, dataType) => {
    return new Promise(async(res, rej) => {
        // differentiate the tables with datatype and add them to table 
        if(dataType === "stationdata"){
            return db.addCSVtoTable("stations", filepath);
        }

        if(dataType === "journeydata"){
            return db.addCSVtoTable("journeys", filepath);
        }
    });
    
}

const downloadStationData = (dir) => {
    return new Promise((res, rej) => {
        const url = "https://opendata.arcgis.com/datasets/726277c507ef4914b0aec3cbcfcbfafc_0.csv";
        const file = fs.createWriteStream(dir+"/stations.csv");

        const req = https.get(url, (response) => {
            response.pipe(file);

            file.on("finish", async() => {
                file.close();
                await db.addCSVtoTable("stations", file.path)
                await db.updateStationsWithCity();
                res("Finished downloading -> "+url);
            });
            file.on("error", (err) => {
                file.close()
                rej(err.message)
            })
        });
    })
}

const downloadJourneyData = (dir) => {
    return new Promise(async(res, rej) => {

        const urls = ["https://dev.hsl.fi/citybikes/od-trips-2021/2021-05.csv",
                    "https://dev.hsl.fi/citybikes/od-trips-2021/2021-06.csv",
                    "https://dev.hsl.fi/citybikes/od-trips-2021/2021-07.csv"]

        for (const u of urls){

            const parsed = urlParse.parse(u);
            const file = fs.createWriteStream(dir+"/"+path.basename(parsed.pathname));

            let url = await followURLredirect(u);

            const req = https.get(url, (response) => {
                response.pipe(file);

                file.on("finish", async () => {
                    file.close();
                    console.log("Finished downloading -> "+url);
                    await db.addCSVtoTable("journeys", file.path);
                    res();
                })
            })
        }
    });
}

const followURLredirect = (url) => {
    return new Promise((res, rej) => {
        https.get(url, response => {

            if(response.statusCode === 307 ){
                return res(followURLredirect(response.headers.location));
            }
        
            if(response.statusCode === 200){
                return res(url);
            }
        })
    })
}

module.exports = populateDB;