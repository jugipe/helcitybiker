import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getStationInfoFromApi } from "../api/getStationInfoFromApi";
import Spinner from "./Spinner";

const StationInfo = () => {

    // Get station name with useParams hook
    const { name } = useParams();
    const [ station, setStation ] = useState([]);
    const [ error, setError ] = useState(false);
    const [ isLoading, setIsLoading ] = useState(true);

    useEffect(() => {
        getStationInfoFromApi(name)
            .then(array => array[0]) // Api returns an array of one, so only take the first from array
            .then(setStation)
            .then(() => setIsLoading(false))
            .catch(err => setError(true))
    }, [name]);

    // loading screen while waiting on api calls
    if(isLoading){return (<Spinner />)}

    // return error message if API call fails
    if(error){return (<h1 className="mt-3 h1 stationInfoCard">Unable to fetch data</h1>)}

    // return error message if API call returns no data
    if(station === undefined || station.nimi === undefined){return <h1 className="h1 mt-3 stationInfoCard">No Stationdata With Given Station Name</h1>}

    return (
        <div>
            <h1 className="h1 mt-3">{station.nimi}</h1>
            <div className="container d-flex flex-row mt-2 d-inline-block flex-row">
                <div className="stationInfoCard d-flex mt-2 w-50 flex-column">
                    <h2 className="h2">{station.osoite}</h2>
                    <h3 className="h3">{station.kaupunki}</h3>
                    <p className="text">placeholder for starting journeys</p>
                    <p className="text">placeholder for ending journeys</p>
                </div>
                <div className="stationInfoCard d-inline-flex p2 w-50 justify-content-center flex-column bg-warning">
                    <p className="text">Map placeholder</p>
                </div>
            </div>
        </div>
    )
}

export default StationInfo;