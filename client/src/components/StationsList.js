import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const StationList = () => {
    const [ stations, setStations ] = useState([]);

    useEffect(() => {
        fetch("http://localhost:9001/stations")
            .then(data => data.json())
            .then(setStations)
    }, []);

    return (
        <div className="container">
            <h1 className="text-center mt-3">City Bike Stations</h1>
            <table className="table table-sm table-dark table-striped table-hover table mt-4 text-center">
                <thead>
                <tr>
                    <th>Station name</th>
                    <th>Address</th>
                </tr>
                </thead>
                <tbody>
                    {stations.map(station => (
                    <tr key={station.name}>
                        <td><Link className="links" to={"/stationinfo/"+station.name}>{station.name}</Link></td>
                        <td>{station.osoite}</td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default StationList;