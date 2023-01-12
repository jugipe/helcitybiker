import { render, screen, act, waitFor } from "@testing-library/react";
import StationInfo from "../components/StationInfo";
import { getStationInfoFromApi } from "../api/getStationInfoFromApi";
import { BrowserRouter } from "react-router-dom";
import { Map } from "../components/Map"

/**
 * Mock the api module
 */
jest.mock("../api/getStationInfoFromApi");

/**
 * Mock the Map child component
 */
jest.mock("../components/Map", () => {
  return { __esModule: true,
    default: () => {
      return <div/>;
    },
    Map: () => {
      return <div/>;
    },
  }
});

describe("StationInfo Component", () => {

    // After each test clear the mock
    beforeEach(() => jest.clearAllMocks());
  
    it("should render journeys when api responds", async () => {

        getStationInfoFromApi.mockResolvedValue({info: {"fid":1, "id":101, "nimi":"Test1", "namn":"Test1", "name":"Test1", "osoite":"Testikatu 1", "address":"Testgatan 1",
                                                        "kaupunki":"Testikaupunki", "stad":"Teststad", "operaattori":"Testbike oy", "kapasiteetti":10, "location_x":"23.7587167",
                                                         "location_y":"61.4981489"},
                                                departureStats: { departures: "1", avg_dep_dist: "10" },
                                                returnStats: { returns: "1", avg_ret_dist: "10" },
                                                top5dep: [{departure_name: "Test2", departure_id: 2}],
                                                top5ret: [{return_name: "Test2", return_id: 2}] 
                                                });

      // Render the component
      render(<BrowserRouter><StationInfo/></BrowserRouter>);

      // See if all the content of mocked resolve value is rendered
      await act(async() => {
        await act(() => {
          screen.findByText("Test1");
          screen.findByText("Test2");
          screen.findByText("2043 m");
          screen.findByText("500 s");
        });
      });
    });

    it("should render error when api returns an empty array", async () => {
        getStationInfoFromApi.mockResolvedValue([]);
        
      render(<BrowserRouter><StationInfo/></BrowserRouter>);
      
      // See if the error message is rendered
      await act(async() => {
        await act(() => {
          screen.findByText("Unable to fetch data");
        });
      });
    });

    it("should render error message when api fails", async () => {
        getStationInfoFromApi.mockRejectedValue({});

      async () => render(<BrowserRouter><StationInfo/></BrowserRouter>);
      
      await act(async() => {
        await act(() => {
          screen.findByText("Unable to fetch data");
        });
      });
    });
});