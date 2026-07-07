export default function Tweet({ tweet }) {
    const { userName, content, date } = tweet;

    return (
        <article className="tweet">
            <div className="tweet-header">
                <span className="tweet-username">{userName}</span>
                <span className="tweet-time">
                    {new Date(date).toISOString()}
                </span>
            </div>
            <p className="tweet-text">{content}</p>
        </article>
    );
}
