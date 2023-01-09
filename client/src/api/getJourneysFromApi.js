export const getJourneysFromApi = (offset, limit) => {
    return fetch(process.env.REACT_APP_API_HOST+"/journeys?offset="+offset+"&limit="+limit).then((response) => {
      if (response.status === 200) return response.json();
      else throw new Error("Invalid response");
    });
  };