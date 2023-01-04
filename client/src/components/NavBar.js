import { Link } from "react-router-dom";

const NavBar = () => {
    return (
        <div className="container mt-3 vh-5">
            <nav className="navbar navbar-dark dark">
                <Link className="px-5 NavBar links" to="/">Journeys</Link>
                <Link className="px-5 NavBar links" to="/stations">Stations</Link>
            </nav>
        </div>
    )
}

export default NavBar;