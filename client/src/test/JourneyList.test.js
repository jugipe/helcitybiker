import { render, screen, waitFor, act } from "@testing-library/react";
import JourneyList from "../components/JourneyList";
import { getJourneysFromApi } from "../api/getJourneysFromApi";
import { BrowserRouter } from "react-router-dom";

/**
 * Mock the api module
 */
jest.mock("../api/getJourneysFromApi");

describe("JourneyList Component", () => {

    // After each test clear the mock
    beforeEach(() => jest.clearAllMocks());
  
    it("should render journeys when api responds", async () => {

      getJourneysFromApi.mockResolvedValue([{"id": 1, "departure": "2021-05-31T23:57:25", "return": "2021-06-01T00:05:46",
       "departure_id":101, "departure_name": "Test1", "return_id": 102, "return_name": "Test2", "distance": 2043, "duration": 500}]);

      // Render the component
      render(<BrowserRouter><JourneyList/></BrowserRouter>);

      // See if all the content of mocked resolve value is rendered
      await act(async () => {
        await act(() => {
          screen.findByText("Test1");
          screen.findByText("Test2");
          screen.findByText("2043 m");
          screen.findByText("500 s");
        });
      });
    });


    it("should render error when api returns an empty array", async () => {
      getJourneysFromApi.mockResolvedValue([]);
        
      render(<BrowserRouter><JourneyList/></BrowserRouter>);
      
      // See if the error message is rendered
      await act(async() => {
        await act(() => {
          screen.findByText("Unable to fetch data");
        });
      });
    });


    it("should render error message when api fails", async () => {
      getJourneysFromApi.mockRejectedValue({});

      async () => render(<BrowserRouter><JourneyList/></BrowserRouter>);
      
      await act(() => {
        screen.findByText("Unable to fetch data");
      });
    });
});