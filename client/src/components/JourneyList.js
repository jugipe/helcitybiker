import { useState, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import { getJourneysFromApi } from "../api/getJourneysFromApi";
import Spinner from "./Spinner";
import ReactPaginate from 'react-paginate';

const JourneyList = () => {
    const [ journeys, setJourneys ] = useState([]);
    const [ error, setError ] = useState(false);
    const [ isLoading, setIsLoading ] = useState(true);

    // pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [journeysPerPage] = useState(20);

    useEffect(() => {
        getJourneysFromApi()
            .then(setJourneys)
            .then(() => setIsLoading(false))
            .catch(err => setError(true))
    }, []);

    const indexOfLastJourney = currentPage * journeysPerPage;
    const indexOfFirstJourney = indexOfLastJourney - journeysPerPage;
    const currentJourneyList = journeys.slice(indexOfFirstJourney, indexOfLastJourney);

    const paginate = ({ selected }) => {
        setCurrentPage(selected + 1);
    }

    // loading screen while waiting on api calls
    if(isLoading){return (<Spinner />)}

    // return error message if API call fails
    if(error){return (<h1 className="mt-3 h1 stationInfoCard">Unable to fetch data</h1>)}

    // return error message if API call returns no data
    if(journeys.length === 0){return (<h1 className="mt-3 h1 stationInfoCard">Unable to fetch data</h1>)}

    return (
        <Fragment>
        <div className="container">
            <h1 className="mt-3 h1">City Bike Journeys</h1>
            <table className="table table-sm table-dark table-striped table-hover table mt-4">
                <thead>
                <tr>
                    <th>Departure station</th>
                    <th>Return station</th>
                    <th>Distance</th>
                    <th>Duration</th>
                </tr>
                </thead>
                <tbody>
                    {currentJourneyList.map(journey => (
                    <tr key={journey.id}>
                        <td><Link className="links" to={"/stationinfo/"+journey.departure_name}>{journey.departure_name}</Link></td>
                        <td><Link className="links" to={"/stationinfo/"+journey.return_name}>{journey.return_name}</Link></td>
                        <td className="text">{journey.distance} m</td>
                        <td className="text">{journey.duration} s</td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
        <div className="pagination justify-content-center">
            <ReactPaginate
                    onPageChange={paginate}
                    pageCount={Math.ceil(journeys.length / journeysPerPage)}
                    previousLabel={"Prev"}
                    nextLabel={'Next'}
                    containerClassName={'pagination'}
                    pageLinkClassName={'page-number'}
                    previousLinkClassName={'page-number'}
                    nextLinkClassName={'page-number'}
                    activeLinkClassName={'active'}
            />
        </div>
        </Fragment>
    )
}

export default JourneyList;