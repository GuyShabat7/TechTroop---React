import { NavLink } from "react-router-dom";

export default function NavBar() {
    return (
        <nav className="navbar">
            <NavLink to="/" className="nav-link">Home</NavLink>
            <NavLink to="/profile" className="nav-link">Profile</NavLink>
        </nav>
    );
}
