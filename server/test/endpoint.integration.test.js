const server = require("../src/index.js");
const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();
const db = require("../src/db/db")

chai.use(chaiHttp);

let firstStationName;

describe("Express server", async () =>{
    before("Load test data", async() => {
        
        // Add data from stations.json and journeys.json and to test database
        const stations = require("./test.stations.json");
        for (const e of stations){
            await db.addStation(e[0], e[1], e[2], e[3], e[4], e[5], e[6], e[7], e[8], e[9], e[10], e[11], e[12], e[13]);
        }

        const journeys = require("./test.journeys.json");
        for(const e of journeys){
            await db.addJourney(e[0], e[1], e[2], e[3], e[4], e[5], e[6], e[7], e[8]);
        }
        
        console.log("---");
    });

    after("Clear test data", async() => {
        const arr = ["stations", "journeys"];  
        await db.truncateTable(arr);
    });

    const port = process.env.API_PORT || 8000;
    const api = "localhost:"+port;

    describe("/GET stations",  async () => {
        it("it should have status 200", (done) => {
            chai.request(api)
                .get("/stations")
                .end((err, res) => {
                    res.should.have.status(200);
                done();
                });
        });
        it("it should return a json array", (done) => {
            chai.request(api)
                .get("/stations")
                .end((err, res) => {
                    res.body.should.be.a("array");
                done();
            });
        });
        it("it should GET all the stations", (done) => {
            chai.request(api)
                .get("/stations")
                .end((err, res) => {               
                    res.body.length.should.be.not.equal(0);
                done();
                });
        });
    });

    describe("/GET journeys",  async () => {
        it("it should have status 200", (done) => {
            chai.request(api)
                .get("/journeys")
                .end((err, res) => {
                    res.should.have.status(200);
                done();
                });
        });
        it("it should return a json array", (done) => {
            chai.request(api)
                .get("/journeys")
                .end((err, res) => {
                    res.body.should.be.a("array");
                done();
            });
        });
        it("it should GET all the journeys", (done) => {
            chai.request(api)
                .get("/journeys")
                .end((err, res) => {
                    res.body.length.should.be.not.equal(0);
                done();
                });
        });
    });

    describe("/GET a station",  async () => {

        // Get the first station name from test data
        const stations = require("./test.stations.json");
        const firstStationName = stations[0][2];

        it("it should have status 200", (done) => {
            chai.request(api)
                .get("/stations/"+firstStationName)
                .end((err, res) => {
                    res.should.have.status(200);
                done();
                });
        });
        it("it should should not be an array", (done) => {
            chai.request(api)
                .get("/stations/"+firstStationName)
                .end((err, res) => {
                    res.should.not.be.a("array");
                    res.body.should.be.a("object");
                done();
                });
        });
        it("it should GET station info", (done) => {
            chai.request(api)
                .get("/stations/"+firstStationName)
                .end((err, res) => {
                    res.body.should.have.property("name").equal(firstStationName);
                done();
                });
        });
    });

    describe("/GET a non-existent station",  async () => {
        it("it should not GET station info", (done) => {
            chai.request(api)
                .get("/stations/nonexistingstation")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.not.be.a("array");
                    res.body.should.be.empty;
                done();
                });
        });
    
    });
    
    describe("/GET non existent route",  async () => {
        it("it should return 404", (done) => {
            chai.request(api)
                .get("/nonexistingroute")
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
    });
});