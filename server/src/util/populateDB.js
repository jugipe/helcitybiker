const fs = require("fs");
const path = require("path");
const db = require("../db/db");
const urlParse = require("url");
const https = require("https");

const populateDB = (dir) => {
    // names of the folders that should have the data inside
    const dirs = ["stationdata", "journeydata"];
    dirs.forEach(folder => {
        readFiles(dir+folder, folder)
    });
}

const readFiles = (dir, dataType) => {

    // read all the files in a directory
    fs.readdir(dir, (error, fileNames) => {
        if(error) throw error;

        // For each filename get the path and extension
        fileNames.forEach(filename => {
            const ext = path.parse(filename).ext;
            const filepath = path.resolve(dir, filename);

            fs.stat(filepath, (error, stat) => {
                if(error){
                    throw error;
                }

                // check that it is a file and not a directory
                const isFile = stat.isFile();

                // read the if it is a file and has .csv extension
                if(isFile && ext === ".csv"){
                    readCSV(filepath, dataType);
                }
            });
        });

        if(fileNames.length === 0){
            if(dataType === "stationdata"){
                downloadStationData(dir);
            } else if (dataType === "journeydata"){
                downloadJourneyData(dir);
            }
        }
    });
}

const readCSV = async(filepath, dataType) => {
    
    // differentiate the tables with datatype and add them to table 
    if(dataType === "stationdata"){
        await db.addCSVtoTable("stations", filepath);
    }

    if(dataType === "journeydata"){
        await db.addCSVtoTable("journeys", filepath);
    }
    
}

const downloadStationData = (dir) => {
    const url = "https://opendata.arcgis.com/datasets/726277c507ef4914b0aec3cbcfcbfafc_0.csv";
    const file = fs.createWriteStream(dir+"/stations.csv");

    const req = https.get(url, (response) => {
        response.pipe(file);

        file.on("finish", () => {
            file.close();
            console.log("Finished downloading -> "+url);
            db.addCSVtoTable("stations", file.path)
        });
    });
}

const downloadJourneyData = async(dir) => {
    const urls = ["https://dev.hsl.fi/citybikes/od-trips-2021/2021-05.csv",
                  "https://dev.hsl.fi/citybikes/od-trips-2021/2021-06.csv",
                  "https://dev.hsl.fi/citybikes/od-trips-2021/2021-07.csv"]

    for (const u of urls){

        const parsed = urlParse.parse(u);
        const file = fs.createWriteStream(dir+"/"+path.basename(parsed.pathname));

        let url = await followURLredirect(u);

        const req = https.get(url, (response) => {
            response.pipe(file);

            file.on("finish", () => {
                file.close();
                console.log("Finished downloading -> "+url);
                db.addCSVtoTable("journeys", file.path);
            })
        })
    }
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