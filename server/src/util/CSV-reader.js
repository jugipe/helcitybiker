const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse");
const db = require("../db/db")

const readCSV = (filepath, dataType) => {
    fs.createReadStream(filepath)

        // pipe stream chunks and split them, ignore first line
        .pipe(parse({ delimiter: ",", from_line: 2}))
        
        // when some parsed data is ready add it to right table
        .on("data", (row) => {
            if(dataType === "stationdata"){
                db.addStation(...row);
            } else if (dataType === "journeydata"){
                db.addJourney(...row);
            }
        })
        .on("end", () => {
            console.log(filepath+" - processing finished");
        })
        .on("error", (error) => {
            console.log(error.message);
        });
}

const readFiles = (dir, dataType) => {

    // read all the files in a directory

    fs.readdir(dir, (error, fileNames) => {
        if(error) throw error;

        fileNames.forEach(filename => {
            const ext = path.parse(filename).ext;
            const filepath = path.resolve(dir, filename);

            fs.stat(filepath, (error, stat) => {
                if(error){
                    throw error;
                }

                // check that it is a file and not a directory
                const isFile = stat.isFile();

                // read the CSV file if it is a .csv file
                if(isFile && ext === ".csv"){
                    readCSV(filepath, dataType);
                }

            });
        });
    })
}

module.exports = readFiles;

