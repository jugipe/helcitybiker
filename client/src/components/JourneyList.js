import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getJourneysFromApi } from "../api/getJourneysFromApi"

const JourneyList = () => {
    const [ journeys, setJourneys ] = useState([]);
    const [ error, setError ] = useState(false);

    useEffect(() => {
        getJourneysFromApi()
            .then(setJourneys)
            .catch(err => setError(true))
    }, []);

    // return error message if API call fails
    if(error){return (<h1 className="mt-3 h1 stationInfoCard">Unable to fetch data</h1>)}

    // return error message if API call returns no data
    if(journeys.length === 0){return (<h1 className="mt-3 h1 stationInfoCard">Unable to fetch data</h1>)}

    return (
        <div className="container">
            <h1 className="mt-3 h1">City Bike Journeys</h1>
            <table className="table table-sm table-dark table-striped table-hover table mt-4">
                <thead>
                <tr>
                    <th>Departure station</th>
                    <th>Return station</th>
                    <th>Distance</th>
                    <th>Duration</th>
                </tr>
                </thead>
                <tbody>
                    {journeys.map(journey => (
                    <tr key={journey.id}>
                        <td><Link className="links" to={"/stationinfo/"+journey.departure_name}>{journey.departure_name}</Link></td>
                        <td><Link className="links" to={"/stationinfo/"+journey.return_name}>{journey.return_name}</Link></td>
                        <td className="text">{journey.distance} m</td>
                        <td className="text">{journey.duration} s</td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default JourneyList;