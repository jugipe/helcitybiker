import { Link } from "react-router-dom";

const NavBar = () => {
    return (
        <div className="container mt-3">
            <nav className="navbar navbar-dark dark justify-content-start">
                <Link className="px-4 NavBar links" to="/">JOURNEYS</Link>
                <Link className="px-4 NavBar links" to="/stations">STATIONS</Link>
            </nav>
        </div>
    )
}

export default NavBar;