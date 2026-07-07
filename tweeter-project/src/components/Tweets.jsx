export default function Tweet({ tweet }) {
    const { username, text, createdAt } = tweet;

    return (
        <article className="tweet">
            <div className="tweet-header">
                <span className="tweet-username">{username}</span>
                <span className="tweet-time">
                    {new Date(createdAt).toISOString()}
                </span>
            </div>
            <p className="tweet-text">{text}</p>
        </article>
    );
}
