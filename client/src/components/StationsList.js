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
        <div className="container text-center">
            <h1 className="mt-2 h1">CITY BIKE STATIONS</h1>
            <table className="table table-sm table-dark table-striped table-hover table mt-3">
                <thead>
                <tr>
                    <th className="w-50">Station name</th>
                    <th className="w-50">Address</th>
                </tr>
                </thead>
                <tbody>
                    {currentStationList.map(station => (
                    <tr key={station.id}>
                        <td><Link className="links" to={"/stations/"+station.id}>{station.nimi}</Link></td>
                        <td className="text">{station.osoite}</td>
                    </tr>
                    ))}
                </tbody>
            </table>
            <ReactPaginate 
                    onPageChange={paginate}
                    pageCount={Math.ceil(Number(stations.length) / stationsPerPage)}
                    previousLabel="Prev"
                    nextLabel='Next'
                    breakLabel="..."
                    breakLinkClassName="page-link"
                    breakClassName="page-item"
                    pageRangeDisplayed="3"
                    marginPagesDisplayed="1"
                    containerClassName="pagination pagination-sm justify-content-center mt-3"
                    pageClassName="page-item"
                    pageLinkClassName="page-link"
                    previousClassName="page-item"
                    previousLinkClassName="page-link"
                    nextClassName="page-item"
                    nextLinkClassName="page-link"
                    activeLinkClassName="active"
            />
        </div>
    )
}

export default StationList;