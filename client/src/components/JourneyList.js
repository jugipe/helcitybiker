import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getJourneysFromApi } from "../api/getJourneysFromApi";
import Spinner from "./Spinner";
import ReactPaginate from 'react-paginate';

const JourneyList = () => {
    const [ data, setData ] = useState([]);
    const [ error, setError ] = useState(false);
    const [ isLoading, setIsLoading ] = useState(true);

    // pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [journeysPerPage] = useState(20);

    const indexOfFirstJourney = currentPage * journeysPerPage - journeysPerPage;

    useEffect(() => {
        getJourneysFromApi(indexOfFirstJourney, journeysPerPage)
            .then(setData)
            .then(() => setIsLoading(false))
            .catch(err => setError(true))
    }, [indexOfFirstJourney, journeysPerPage]);


    //const currentJourneyList = journeys[0].slice(indexOfFirstJourney, indexOfLastJourney);

    const paginate = ({ selected }) => {
        setCurrentPage(selected + 1);
    }

    // loading screen while waiting on api calls
    if(isLoading){return (<Spinner />)}

    // return error message if API call fails
    if(error){return (<h1 className="mt-3 h1 stationInfoCard">Unable to fetch data</h1>)}

    // return error message if API call returns no data
    if(data.journeys === undefined || data.journeys.length === 0){return (<h1 className="mt-3 h1 stationInfoCard">Unable to fetch data</h1>)}

    return (
        <div className="container">
            <h1 className="mt-3 h1">CITY BIKE JOURNEYS</h1>
            <table className="table table-sm table-dark table-striped table-hover table mt-4">
                <thead>
                <tr>
                    <th className="w-25">Departure station</th>
                    <th className="w-25">Return station</th>
                    <th className="w-25">Distance</th>
                    <th className="w-25">Duration</th>
                </tr>
                </thead>
                <tbody>
                    {data.journeys.map(journey => (
                    <tr key={journey.id}>
                        <td ><Link className="links" to={"/stations/"+journey.departure_id}>{journey.departure_name}</Link></td>
                        <td ><Link className="links" to={"/stations/"+journey.return_id}>{journey.return_name}</Link></td>
                        <td className="text">{journey.distance} m</td>
                        <td className="text">{journey.duration} s</td>
                    </tr>
                    ))}
                </tbody>
            </table>
            <ReactPaginate 
                    onPageChange={paginate}
                    pageCount={Math.ceil(Number(data.total) / journeysPerPage)}
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

export default JourneyList;