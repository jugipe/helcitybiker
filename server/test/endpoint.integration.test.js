const server = require("../src/index.js");
const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();
const db = require("../src/db/db")

chai.use(chaiHttp);

describe("Express server", async () =>{
    before("Load test data", async() => { 
        await db.addStation(1,503, "Keilalahti","Kägelviken","Keilalahti","Keilalahdentie 2",
        "Kägelviksvägen 2","Espoo","Esbo","CityBike Finland", 10, "28,24.827467","60.171524");

        await db.addJourney("2021-05-31T23:57:25", "2021-06-01T00:05:46", 094, "Laajalahden aukio",
         100, "Teljäntie", 2043, 500);

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
                .get("/journeys")
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
        it("it should have status 200", (done) => {
            chai.request(api)
                .get("/stations/Keilalahti")
                .end((err, res) => {
                    res.should.have.status(200);
                done();
                });
        });
        it("it should should not be an array", (done) => {
            chai.request(api)
                .get("/stations/Keilalahti")
                .end((err, res) => {
                    res.should.not.be.a("array");
                    res.body.should.be.a("object");
                done();
                });
        });
        it("it should GET station info", (done) => {
            chai.request(api)
                .get("/stations/Keilalahti")
                .end((err, res) => {
                    res.body.should.have.property("name").equal("Keilalahti");
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