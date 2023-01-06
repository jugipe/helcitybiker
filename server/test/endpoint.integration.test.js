const server = require("../src/index.js");
const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();
const db = require("../src/db/db")
const path = require("path");
const populateDB = require("../src/util/populateDB");

chai.use(chaiHttp);

describe("Express server", async () =>{
    before("Load test data", async() => {
        
        // Add data from testdata and add it to test database
        await populateDB(path.join(__dirname, "/testdata/"));
        
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
                    res.body.length.should.be.equal(5);
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
                    res.body.length.should.be.equal(5);
                done();
                });
        });
    });

    describe("/GET a station",  async () => {

        // Get the first station name of known data
        const firstStationName = "Test1"

        it("it should have status 200", (done) => {
            chai.request(api)
                .get("/stations/"+firstStationName)
                .end((err, res) => {
                    res.should.have.status(200);
                done();
                });
        });
        it("it should return a json array", (done) => {
            chai.request(api)
                .get("/stations/"+firstStationName)
                .end((err, res) => {
                    res.body.should.be.a("array");
                done();
                });
        });
        it("it should GET only one station", (done) => {
            chai.request(api)
                .get("/stations/"+firstStationName)
                .end((err, res) => {
                    res.body.length.should.be.equal(1);
                done();
                });
        });
        it("it should GET station info", (done) => {
            chai.request(api)
                .get("/stations/"+firstStationName)
                .end((err, res) => {
                    // res body should be only len 1, so we can take the first element
                    // and test against it
                    const data = res.body[0];
                    data.should.include({nimi: firstStationName})
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