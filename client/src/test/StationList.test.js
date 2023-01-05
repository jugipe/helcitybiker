import { render, screen, waitFor } from "@testing-library/react";
import StationList from "../components/StationsList";
import { getStationsFromApi } from "../api/getStationsFromApi";
import { BrowserRouter } from "react-router-dom";

/**
 * Mock the api module
 */
jest.mock("../api/getStationsFromApi");

describe("StationList Component", () => {

    // After each test clear the mock
    beforeEach(() => jest.clearAllMocks());
  
    it("should render journeys when api responds", async () => {

      getStationsFromApi.mockResolvedValue([{"fid":1, "id":101, "nimi":"Test1", "namn":"Test1", "name":"Test1", "osoite":"Testikatu 1", "address":"Testgatan 1",
       "kaupunki":"Testikaupunki", "stad":"Teststad", "operaattori":"Testbike oy", "kapasiteetti":10, "location_x":"23.7587167", "location_y":"61.4981489"}]);

      // Render the component
      render(<BrowserRouter><StationList/></BrowserRouter>);

      // See if all the content of mocked resolve value is rendered
      await waitFor(() => {
        screen.findByText("Test1");
        screen.findByText("Testikatu 1");
      });
    });

    it("should render error when api returns an empty array", async () => {
        getStationsFromApi.mockResolvedValue([]);
        
      render(<BrowserRouter><StationList/></BrowserRouter>);
      
      // See if the error message is rendered
      await waitFor(() => {
        screen.findByText("Unable to fetch data");
      });
    });

    it("should render error message when api fails", async () => {
        getStationsFromApi.mockRejectedValue({});

      async () => render(<BrowserRouter><StationList/></BrowserRouter>);
      
      await waitFor(() => {
        screen.findByText("Unable to fetch data");
      });
    });
});