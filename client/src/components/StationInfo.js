import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getStationInfoFromApi } from "../api/getStationInfoFromApi";
import Spinner from "./Spinner";

const StationInfo = () => {

    // Get station id with useParams hook
    const { id } = useParams();
    const [ stationInfo, setStationInfo ] = useState([]);
    const [ error, setError ] = useState(false);
    const [ isLoading, setIsLoading ] = useState(true);

    useEffect(() => {
        getStationInfoFromApi(id) 
            .then(setStationInfo) 
            .then(() => setIsLoading(false))
            .catch(err => setError(true))
    }, [id]);

    // loading screen while waiting on api calls
    if(isLoading){return (<Spinner />)}

    // return error message if API call fails
    if(error){return (<h1 className="mt-3 h1 stationInfoCard">Unable to fetch data</h1>)}

    // return error message if API call returns no data
    if(stationInfo === undefined || stationInfo.info === undefined){return <h1 className="h1 mt-3 stationInfoCard">No Stationdata With Given Station Name</h1>}


    return (
        <div>
            <h1 className="h1 mt-3">{stationInfo.info.nimi}</h1>
            <div className="container d-flex flex-row mt-2 d-inline-block flex-row">
                <div className="stationInfoCard d-flex mt-2 w-50 flex-column">
                    <h2 className="h2">{stationInfo.info.osoite}</h2>
                    <h3 className="h3">{stationInfo.info.kaupunki}</h3>
                    <div className="d-flex flex-column mt-3">
                        <table className="table flex-row">
                            <thead>
                                <tr>
                                    <th>Total Departures</th>
                                    <th>Total Returns</th>
                                    <th>Average Departure Distance</th>
                                    <th>Average Return Distance</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{stationInfo.departureStats.departures}</td>
                                    <td>{stationInfo.returnStats.returns}</td>
                                    <td>{Math.floor(stationInfo.departureStats.avg_dep_dist)} m</td>
                                    <td>{Math.floor(stationInfo.returnStats.avg_ret_dist)} m</td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="d-flex flex-row mt-3">
                            <table className="table w-50 ml-2">
                                <thead>
                                    <tr>
                                        <th>Top 5 Departures</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {stationInfo.top5dep.map(station => (
                                    <tr key={station.departure_id}><td><Link className="links" to={"/stations/"+station.departure_id}>{station.departure_name}</Link></td></tr>
                                ))}
                                </tbody>
                            </table>
                            <table className="table w-50">
                                <thead>
                                    <tr>
                                        <th>Top 5 Returns</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stationInfo.top5ret.map(station => (
                                        <tr key={station.return_id}><td><Link className="links" to={"/stations/"+station.return_id}>{station.return_name}</Link></td></tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="stationInfoCard d-inline-flex p2 w-50 justify-content-center flex-column bg-warning">
                    <p className="text">Map placeholder</p>
                </div>
            </div>
        </div>
    )
}

export default StationInfo;