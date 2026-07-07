import Tweet from "./Tweets";

export default function TweetList({ tweets }) {
    const sorted = [...tweets].sort((a, b) => b.createdAt - a.createdAt);

    if (sorted.length === 0) {
        return <p className="empty">No tweets yet. Say something!</p>;
    }

    return (
        <section className="tweet-list">
            {sorted.map((tweet) => (
                <Tweet key={tweet.id} tweet={tweet} />
            ))}
        </section>
    );
}
