export const getStationsFromApi = () => {
    return fetch("http://localhost:9001/stations").then((response) => {
      if (response.status === 200) return response.json();
      else throw new Error("Invalid response");
    });
  };