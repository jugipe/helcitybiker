import { useState, useEffect } from "react";

const JourneyList = () => {
    const [ journeys, setJourneys ] = useState([]);

    useEffect(() => {
        fetch("http://localhost:9001/journeys")
            .then(data => data.json())
            .then(setJourneys)
    }, []);

    return (
        <div className="container">
            <h1 className="text-center mt-3">City Bike Journeys</h1>
            <table className="table table-sm table-dark table-striped table-hover table mt-4 text-center">
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
                        <td>{journey.departure_name}</td>
                        <td>{journey.return_name}</td>
                        <td>{journey.distance} m</td>
                        <td>{journey.duration} s</td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default JourneyList;