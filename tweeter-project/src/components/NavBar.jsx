import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";

export default function NavBar() {
    const { session, logout } = useAuth();
    const navigate = useNavigate();

    async function handleLogout() {
        await logout();
        navigate("/login");
    }

    return (
        <nav className="navbar">
            <NavLink to="/" className="nav-link">Home</NavLink>
            <NavLink to="/profile" className="nav-link">Profile</NavLink>
            {session ? (
                <button className="nav-link nav-button" onClick={handleLogout}>
                    Logout
                </button>
            ) : (
                <NavLink to="/login" className="nav-link">Login</NavLink>
            )}
        </nav>
    );
}
