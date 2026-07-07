import { createContext, useContext, useState, useEffect } from "react";
import { loadTweets, saveTweets } from "./storage";

const TweetsContext = createContext(null);

export function TweetsProvider({ children }) {
    const [tweets, setTweets] = useState(() => loadTweets());

    useEffect(() => {
        saveTweets(tweets);
    }, [tweets]);

    useEffect(() => {
        const id = setInterval(() => {
            setTweets(loadTweets());
        }, 5000);
        return () => clearInterval(id);
    }, []);

    function addTweet(tweet) {
        setTweets((prev) => [...prev, tweet]);
    }

    return (
        <TweetsContext.Provider value={{ tweets, addTweet }}>
            {children}
        </TweetsContext.Provider>
    );
}

export function useTweets() {
    return useContext(TweetsContext);
}
