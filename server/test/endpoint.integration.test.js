const server = require("../src/index.js");
const chai = require("chai");
const chaiHttp = require("chai-http");
const db = require("../src/db/db")
const path = require("path");
const populateDB = require("../src/util/populateDB");

const should = chai.should();
const expect = chai.expect();
chai.use(chaiHttp);

describe("Express server", () =>{
    before("Wait for server to load", (done) => 
        server.on("started", done));


    before("Load test data", () => {
   
        // Add data from testdata and add it to test database
        populateDB(path.join(__dirname, "/testdata/"));
        
        console.log("---");
    });

    after("Clear test data", () => {
        const arr = ["raw_stations", "raw_journeys"];  
        db.truncateTable(arr);
    });

    const port = process.env.API_PORT || 8000;
    const api = "localhost:"+port;

    describe("/GET stations",  () => {
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
                    res.body.length.should.be.equal(5);
                done();
            });
        });
    });

    describe("/GET journeys",  () => {
        it("it should have status 200", (done) => {
            chai.request(api)
                .get("/journeys?limit=50")
                .end((err, res) => {
                    res.should.have.status(200);
                done();
            });
        });
        it("it should return a object", (done) => {
            chai.request(api)
                .get("/journeys?limit=50")
                .end((err, res) => {
                    res.body.should.be.a("object");
                done();
            });
        });
        it("it should GET all the journeys", (done) => {
            chai.request(api)
                .get("/journeys?limit=50")
                .end((err, res) => {
                    const data = res.body.journeys;
                    data.length.should.be.equal(5);
                done();
            });
        });
        it("it should return 404 if no limit", (done) => {
            chai.request(api)
                .get("/journeys")
                .end((err, res) => {
                    res.should.have.status(404);
                done();
            });
        });
    });

    describe("/GET a station",  () => {

        // Get the first station name of known data
        const firstStationId = 101

        it("it should have status 200", (done) => {
            chai.request(api)
                .get("/stations/"+firstStationId)
                .end((err, res) => {
                    res.should.have.status(200);
                done();
            });
        });
        it("it should return a object", (done) => {
            chai.request(api)
                .get("/stations/"+firstStationId)
                .end((err, res) => {
                    res.body.should.be.a("object");
                done();
            });
        });
        it("it should GET only one station", (done) => {
            chai.request(api)
                .get("/stations/"+firstStationId)
                .end((err, res) => {
                    res.body.info.should.be.a("object")
                    Object.keys(res.body.info).length.should.be.equal(13)
                done();
            });
        });
        it("it should GET station info", (done) => {
            chai.request(api)
                .get("/stations/"+firstStationId)
                .end((err, res) => {
                    // res body should be only len 1, so we can take the first element
                    // and test against it
                    const data = res.body.info;
                    data.should.include({id: firstStationId});
                    data.should.include({nimi: "Test1"});
                done();
            });
        });
    });

    describe("/GET a non-existent station",  () => {
        it("it should not GET station info", (done) => {
            chai.request(api)
                .get("/stations/1511984148")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.not.be.a("array");
                    res.body.should.not.have.keys("info");
                    res.body.departureStats.departures.should.be.equal("0");
                done();
            });
        });
    });
    
    describe("/GET non existent route",   () => {
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