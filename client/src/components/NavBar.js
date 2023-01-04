import { Link } from "react-router-dom";

const NavBar = () => {
    return (
        <div className="container mt-3">
            <nav className="navbar navbar-dark bg-dark">
                <Link className="px-5" to="/">Journeys</Link>
                <Link className="px-5" to="/stations">Stations</Link>
            </nav>
        </div>
    )
}

export default NavBar;