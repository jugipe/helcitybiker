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

    if(station === undefined || station.name === undefined){return <h1>No Stationdata with Given Station Name</h1>}

    return (
        <h1>{station.name}</h1>
    )
}

export default StationInfo;