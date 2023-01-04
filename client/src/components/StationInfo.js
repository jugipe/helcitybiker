import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const StationInfo = () => {

    // Get station name with useParams hook
    const { name } = useParams();

    const [ station, setStation ] = useState({});

    useEffect(() => {
        fetch("http://localhost:9001/stations/"+name)
            .then(data => data.json())
            .then(array => array[0]) // take the first of the array
            .then(setStation)
    }, [name]);

    if(station === undefined || station.name === undefined){return <h1 className="h1 mt-3 stationInfoCard">No Stationdata with Given Station Name</h1>}

    return (
        <div>
            <h1 className="h1 mt-3">{station.name}</h1>
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