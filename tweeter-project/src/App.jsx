import { useState } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import { AuthProvider } from "./lib/AuthContext";
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
        <AuthProvider>
            <HashRouter>
                <NavBar />
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <TweetsProvider>
                                    <HomePage username={username} />
                                </TweetsProvider>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <ProfilePage username={username} onSave={updateUsername} />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </HashRouter>
        </AuthProvider>
    );
}
