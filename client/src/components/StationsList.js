import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getStationsFromApi } from "../api/getStationsFromApi";
import Spinner from "./Spinner";
import ReactPaginate from 'react-paginate';

const StationList = () => {
    const [ stations, setStations ] = useState([]);
    const [ error, setError ] = useState(false);
    const [ isLoading, setIsLoading ] = useState(true);

    // pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [stationsPerPage] = useState(20);

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

    const indexOfLastStation = currentPage * stationsPerPage;
    const indexOfFirstStation = indexOfLastStation - stationsPerPage;
    const currentStationList = stations.slice(indexOfFirstStation, indexOfLastStation);

    const paginate = ({ selected }) => {
        setCurrentPage(selected + 1);
    }

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
                    {currentStationList.map(station => (
                    <tr key={station.id}>
                        <td><Link className="links" to={"/stationinfo/"+station.id}>{station.nimi}</Link></td>
                        <td className="text">{station.osoite}</td>
                    </tr>
                    ))}
                </tbody>
            </table>
            <ReactPaginate className="pagination justify-content-center mt-2"
                    onPageChange={paginate}
                    pageCount={Math.ceil(stations.length / stationsPerPage)}
                    previousLabel={"Prev"}
                    nextLabel={'Next'}
                    containerClassName={'pagination'}
                    pageLinkClassName={'page-number'}
                    previousLinkClassName={'page-number'}
                    nextLinkClassName={'page-number'}
                    activeLinkClassName={'active'}
            />
        </div>
    )
}

export default StationList;