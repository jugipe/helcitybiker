import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getStationsFromApi } from "../api/getStationsFromApi";
import Spinner from "./Spinner";

const StationList = () => {
    const [ stations, setStations ] = useState([]);
    const [ error, setError ] = useState(false);
    const [ isLoading, setIsLoading ] = useState(true);

    useEffect(() => {
        getStationsFromApi()
            .then(setStations)
            .then(() => setIsLoading(false))
            .catch((err) => setError(true))
    }, []);

    // loading screen while waiting on api calls
    if(isLoading){return (<Spinner />)}

    // return error message if API call fails
    if(error){return (<h1 className="mt-3 h1 stationInfoCard">Unable to fetch data</h1>)}

    // return error message if API call returns no data
    if(stations.length === 0){return (<h1 className="mt-3 h1 stationInfoCard">Unable to fetch data</h1>)}

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
                    <tr key={station.nimi}>
                        <td><Link className="links" to={"/stationinfo/"+station.nimi}>{station.nimi}</Link></td>
                        <td className="text">{station.osoite}</td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default StationList;