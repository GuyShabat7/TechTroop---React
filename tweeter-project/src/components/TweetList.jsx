import Tweet from "./Tweets";

export default function TweetList({ tweets }) {
    const sorted = [...tweets].sort((a, b) => new Date(b.date) - new Date(a.date));

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
