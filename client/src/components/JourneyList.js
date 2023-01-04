import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const JourneyList = () => {
    const [ journeys, setJourneys ] = useState([]);

    useEffect(() => {
        fetch("http://localhost:9001/journeys")
            .then(data => data.json())
            .then(setJourneys)
    }, []);

    return (
        <div className="container">
            <h1 className="mt-3">City Bike Journeys</h1>
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