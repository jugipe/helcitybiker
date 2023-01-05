import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getStationsFromApi } from "../api/getStationsFromApi"

const StationList = () => {
    const [ stations, setStations ] = useState([]);

    useEffect(() => {
        getStationsFromApi()
            .then(setStations)
            .catch(err => console.log(err))
    }, []);

    return (
        <div className="container">
            <h1 className="mt-3 h1">City Bike Stations</h1>
            <table className="table table-sm table-dark table-striped table-hover table mt-4">
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
                        <td className="text">{station.osoite}</td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default StationList;