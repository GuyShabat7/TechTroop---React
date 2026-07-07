import CreateTweet from "../components/CreateTweet";
import TweetList from "../components/TweetList";
import { useTweets } from "../lib/TweetsContext";

export default function HomePage({ username }) {
    const { tweets, addTweet } = useTweets();

    function handleAddTweet(text) {
        addTweet({
            id: crypto.randomUUID(),
            username,
            text,
            createdAt: Date.now(),
        });
    }

    return (
        <main className="home">
            <h1>Tweeter</h1>
            <CreateTweet onAddTweet={handleAddTweet} />
            <TweetList tweets={tweets} />
        </main>
    );
}
