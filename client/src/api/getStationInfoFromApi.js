export const getStationInfoFromApi = (id) => {
    return fetch("http://localhost:9001/stations/"+id).then((response) => {
      if (response.status === 200) return response.json();
      else throw new Error("Invalid response");
    });
  };