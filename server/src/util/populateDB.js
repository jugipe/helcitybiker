const fs = require("fs");
const path = require("path");
const db = require("../db/db");

const populateDB = (dir) => {
    // names of the folders that should have the data inside
    const dirs = ["stationdata", "journeydata"];
    dirs.forEach(folder => {
        readFiles(dir+folder, folder)
    });
    console.log("db populated");
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
    })
}

const readCSV = (filepath, dataType) => {
    
    // differentiate the tables with datatype and add them to table 
    if(dataType === "stationdata"){
        db.addCSVtoTable("stations", filepath);
    }

    if(dataType === "journeydata"){
        db.addCSVtoTable("journeys", filepath);
    }
    
}

module.exports = populateDB;