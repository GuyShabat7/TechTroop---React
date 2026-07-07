import { useState } from "react";

export default function ProfilePage({ username, onSave }) {
    const [name, setName] = useState(username);

    function handleSubmit(e) {
        e.preventDefault();
        onSave(name.trim());
        setName("");
    }

    return (
        <main className="home">
            <h1>Profile</h1>
            <form className="profile-form" onSubmit={handleSubmit}>
                <label className="profile-label" htmlFor="username">User Name</label>
                <input
                    id="username"
                    className="profile-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <div className="profile-actions">
                    <button type="submit">Save</button>
                </div>
            </form>
        </main>
    );
}
