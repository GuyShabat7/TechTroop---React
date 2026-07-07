import { useState } from "react";
import CreateTweet from "../components/CreateTweet";
import TweetList from "../components/TweetList";
import { useTweets } from "../lib/TweetsContext";

export default function HomePage({ username }) {
    const { tweets, loading, addTweet } = useTweets();
    const [posting, setPosting] = useState(false);
    const [error, setError] = useState(null);

    async function handleAddTweet(text) {
        setPosting(true);
        setError(null);
        try {
            await addTweet({
                content: text,
                userName: username,
                date: new Date().toISOString(),
            });
            return true;
        } catch (e) {
            setError(e.message);
            return false;
        } finally {
            setPosting(false);
        }
    }

    return (
        <main className="home">
            <h1>Tweeter</h1>
            <CreateTweet onAddTweet={handleAddTweet} posting={posting} error={error} />
            {loading ? (
                <p className="empty">Loading tweets...</p>
            ) : (
                <TweetList tweets={tweets} />
            )}
        </main>
    );
}
