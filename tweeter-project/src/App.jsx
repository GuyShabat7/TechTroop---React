import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import { loadUsername, saveUsername } from "./lib/user";
import "./App.css";

export default function App() {
    const [username, setUsername] = useState(() => loadUsername());

    function updateUsername(name) {
        setUsername(name);
        saveUsername(name);
    }

    return (
        <BrowserRouter>
            <NavBar />
            <Routes>
                <Route path="/" element={<HomePage username={username} />} />
                <Route
                    path="/profile"
                    element={<ProfilePage username={username} onSave={updateUsername} />}
                />
            </Routes>
        </BrowserRouter>
    );
}
