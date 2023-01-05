const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse");

const readCSV = (filepath) => {
    console.log(filepath);
}

const readFiles = (dir) => {

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
                    readCSV(filepath);
                }

            });
        });
    })
}



module.exports = readFiles, readCSV;

