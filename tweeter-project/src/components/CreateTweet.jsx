import { useState } from "react";
import { MAX_CHARS } from "../lib/constants";

export default function CreateTweet({ onAddTweet, posting, error }) {
    const [text, setText] = useState("");

    const isTooLong = text.length > MAX_CHARS;
    const isEmpty = text.trim().length === 0;

    async function handleSubmit(e) {
        e.preventDefault();
        if (isTooLong || isEmpty || posting) return;
        const ok = await onAddTweet(text.trim());
        if (ok) setText("");
    }

    return (
        <form className="create-tweet" onSubmit={handleSubmit}>
            <textarea
                className="create-tweet-input"
                placeholder="What you have in mind..."
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
            <div className="create-tweet-footer">
                {isTooLong && (
                    <span className="create-tweet-error">
                        The tweet can't contain more then 140 chars.
                    </span>
                )}
                {error && <span className="create-tweet-error">{error}</span>}
                <button type="submit" disabled={isTooLong || posting}>
                    {posting ? "Posting..." : "Tweet"}
                </button>
            </div>
        </form>
    );
}
