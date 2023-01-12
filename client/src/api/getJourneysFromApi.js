export const getJourneysFromApi = (offset, limit) => {
    return fetch("http://localhost:9001/journeys?offset="+offset+"&limit="+limit).then((response) => {
      if (response.status === 200) return response.json();
      else throw new Error("Invalid response");
    });
  };