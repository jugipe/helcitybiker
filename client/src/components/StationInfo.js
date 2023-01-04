import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const StationInfo = () => {

    const loc = window.location.pathname;
    const stationName = loc.split("/")[2];

    const [ station, setStation ] = useState({});

    useEffect(() => {
        fetch("http://localhost:9001/stations/"+stationName)
            .then(data => data.json())
            .then(array => array[0]) // take the first of the array
            .then(setStation)
    }, [stationName]);

    if(station === undefined || station.name === undefined){return <h1>No Stationdata with Given Station Name</h1>}

    return (
        <h1>{station.name}</h1>
    )
}

export default StationInfo;