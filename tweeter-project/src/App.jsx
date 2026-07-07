import { useState } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import { TweetsProvider } from "./lib/TweetsContext";
import { loadUsername, saveUsername } from "./lib/user";
import "./App.css";

export default function App() {
    const [username, setUsername] = useState(() => loadUsername());

    function updateUsername(name) {
        setUsername(name);
        saveUsername(name);
    }

    return (
        <HashRouter>
            <TweetsProvider>
                <NavBar />
                <Routes>
                    <Route path="/" element={<HomePage username={username} />} />
                    <Route
                        path="/profile"
                        element={<ProfilePage username={username} onSave={updateUsername} />}
                    />
                </Routes>
            </TweetsProvider>
        </HashRouter>
    );
}
