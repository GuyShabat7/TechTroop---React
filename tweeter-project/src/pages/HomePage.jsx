import { useState, useEffect } from "react";
import CreateTweet from "../components/CreateTweet";
import TweetList from "../components/TweetList";
import { loadTweets, saveTweets } from "../lib/storage";
import { CURRENT_USER } from "../lib/constants";

export default function HomePage() {
    const [tweets, setTweets] = useState(() => loadTweets());

    useEffect(() => {
        saveTweets(tweets);
    }, [tweets]);

    function handleAddTweet(text) {
        const newTweet = {
            id: crypto.randomUUID(),
            username: CURRENT_USER,
            text,
            createdAt: Date.now(),
        };
        setTweets((prev) => [...prev, newTweet]);
    }

    return (
        <main className="home">
            <h1>Tweeter</h1>
            <CreateTweet onAddTweet={handleAddTweet} />
            <TweetList tweets={tweets} />
        </main>
    );
}
