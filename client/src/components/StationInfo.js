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
            .then(array => setStationInfo(array)) // Api returns an array which we can set up as the stationInfo
            .then(() => setIsLoading(false))
            .catch(err => setError(true))
    }, [id]);

    // loading screen while waiting on api calls
    if(isLoading){return (<Spinner />)}

    // return error message if API call fails
    if(error){return (<h1 className="mt-3 h1 stationInfoCard">Unable to fetch data</h1>)}

    // return error message if API call returns no data
    if(stationInfo === undefined || stationInfo[0].nimi === undefined){return <h1 className="h1 mt-3 stationInfoCard">No Stationdata With Given Station Name</h1>}

    // stationInfo[] => basic information, [1] => departure information, [2] => return information, [3] => top5 departures, [4] => top5 returns

    return (
        <div>
            <h1 className="h1 mt-3">{stationInfo[0].nimi}</h1>
            <div className="container d-flex flex-row mt-2 d-inline-block flex-row">
                <div className="stationInfoCard d-flex mt-2 w-50 flex-column">
                    <h2 className="h2">{stationInfo[0].osoite}</h2>
                    <h3 className="h3">{stationInfo[0].kaupunki}</h3>
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
                                    <td>{stationInfo[1].departures}</td>
                                    <td>{stationInfo[2].returns}</td>
                                    <td>{Math.floor(stationInfo[1].avg_dep_dist)} m</td>
                                    <td>{Math.floor(stationInfo[2].avg_ret_dist)} m</td>
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
                                {stationInfo[3].map(station => (
                                    <tr><Link className="links" to={"/stationinfo/"+station.departure_id}>{station.departure_name}</Link></tr>
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
                                    {stationInfo[4].map(station => (
                                        <tr><Link className="links" to={"/stationinfo/"+station.return_id}>{station.return_name}</Link></tr>
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