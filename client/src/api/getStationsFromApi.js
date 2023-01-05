export const getStationsFromApi = () => {
    return fetch(process.env.REACT_APP_API_HOST+"/stations").then((response) => {
      if (response.status === 200) return response.json();
      else throw new Error("Invalid response");
    });
  };