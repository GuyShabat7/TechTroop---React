import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "./supabase";

const TweetsContext = createContext(null);

export function TweetsProvider({ children }) {
    const [tweets, setTweets] = useState([]);
    const [loading, setLoading] = useState(true);

    async function loadTweets() {
        const { data, error } = await supabase.from("Tweets").select("*");
        if (!error && data) {
            setTweets(data);
        }
    }

    useEffect(() => {
        loadTweets().finally(() => setLoading(false));
        const id = setInterval(loadTweets, 5000);
        return () => clearInterval(id);
    }, []);

    async function addTweet(tweet) {
        const { data, error } = await supabase
            .from("Tweets")
            .insert(tweet)
            .select();
        if (error) throw new Error(error.message);
        setTweets((prev) => [...prev, data[0]]);
    }

    return (
        <TweetsContext.Provider value={{ tweets, loading, addTweet }}>
            {children}
        </TweetsContext.Provider>
    );
}

export function useTweets() {
    return useContext(TweetsContext);
}
