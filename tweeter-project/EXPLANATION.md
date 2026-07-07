# Tweeter — Code Explanation (study guide)

This document explains **how the app works** and **what each piece of React means**,
so you can understand the flow — not just what the code is.

---

## 1. The big picture — who owns what

React apps are a **tree of components**. Data flows **down** through props, and
events flow **up** through callback functions. In our app:

```
App                         ← OWNS the username + sets up routing
 └── TweetsProvider         ← the shared "box" that OWNS the tweets (Context)
      ├── NavBar            ← Home / Profile links, sticky at the top
      └── (routes)
           ├── HomePage     ← READS tweets/addTweet from context; gets username as prop
           │    ├── CreateTweet  ← lets you type a tweet, tells HomePage "add this"
           │    └── TweetList    ← receives the tweets, shows them
           │         └── Tweet   ← shows ONE tweet
           └── ProfilePage  ← edits the username, reports it up to App
```

Two ways data is shared in this app:

1. **Props (lifting state up)** — for the **username**. It's owned by `App` (the common
   parent of both pages) and passed **down** as a prop; changes are reported **up** via the
   `onSave` callback.
2. **Context (a shared box)** — for the **tweets**. Instead of threading them through props,
   `TweetsProvider` holds them, and any component inside calls `useTweets()` to read the
   list or add a tweet. Use this when data is needed by many/deep components.

- Data going **down** = **props** (e.g. `App` passes `username` to `HomePage`).
- Events going **up** = **callback props** (e.g. `ProfilePage` calls `onSave`).
- **Context** = skip the chain; grab shared data directly with a hook.

---

## 2. React concepts used here (the vocabulary)

- **Component**: a function that returns JSX (HTML-like markup). Each of our files
  exports one.
- **Props**: the input arguments a component receives, written as attributes in JSX.
  Read-only — a child never changes its own props.
- **State (`useState`)**: data a component "remembers" between re-renders. When state
  changes, React **re-runs the component function** and updates the screen.
- **`useEffect`**: run a "side effect" (something outside rendering, like writing to
  localStorage) *after* the component renders, and re-run it when chosen values change.
- **Controlled input**: an input whose value comes from state, so React is the single
  source of truth for what's typed.
- **Re-render**: React calls your component function again to figure out the new UI.
  This is normal and cheap — it does NOT reload the page.
- **Context (`createContext` / Provider / `useContext`)**: a way to share data with a whole
  subtree without passing props at every level. `createContext` makes the "box", a
  `<Provider value={...}>` fills it, and `useContext` (via our `useTweets` hook) reads it.
- **Interval (`setInterval` / `clearInterval`)**: run some code repeatedly on a timer. We
  start it in a `useEffect` and **clear it** in the effect's cleanup so it doesn't leak.
- **`async` / `await`**: talking to a server takes time. An `async` function can `await` a
  request, pausing until the response comes back, without freezing the UI. We use it for
  reading and creating tweets in Supabase.
- **Supabase**: our backend. A hosted Postgres database with a ready-made JavaScript client
  (`supabase.from("Tweets").select()` / `.insert()`). The tweets now live there, not in
  localStorage.

---

## 3. The flow, action by action

### A) When the page first loads
1. `App` renders `HomePage`.
2. Inside `HomePage`, `useState(() => loadTweets())` runs **once**. The function
   `loadTweets()` reads the saved tweets from `localStorage`, so refreshing the page
   keeps your tweets. If nothing is saved, it returns `[]`.
3. `HomePage` renders `CreateTweet` and `TweetList`, passing the `tweets` array down.
4. `TweetList` sorts the tweets newest-first and renders a `Tweet` for each.

### B) When you type in the box
1. The textarea in `CreateTweet` is **controlled**: its `value={text}` comes from state.
2. Every keystroke fires `onChange`, which calls `setText(...)` with the new text.
3. `setText` updates state → React re-renders `CreateTweet`.
4. On that re-render it recalculates `isTooLong` and `isEmpty`.
   If the text is over 140 chars, a pink error pill appears and the Tweet button is
   disabled (greyed out). An empty box is also silently blocked from posting.

### C) When you click "Tweet"
1. The form's `onSubmit` calls `handleSubmit`.
2. `e.preventDefault()` stops the browser's default "reload the page on submit".
3. It guards with `if (isDisabled) return;` — no empty/too-long tweets.
4. It calls `onAddTweet(text.trim())` — this is the function **HomePage passed in**.
5. Back in `HomePage`, `handleAddTweet` builds a tweet object and adds it to state.
6. `setText("")` clears the box.

### D) What `handleAddTweet` does (in HomePage)
```js
const newTweet = {
  id: crypto.randomUUID(), // unique id so React can tell tweets apart
  username: CURRENT_USER,  // hard-coded user for now
  text,
  createdAt: Date.now(),   // timestamp (a number) used to sort newest-first
};
setTweets((prev) => [...prev, newTweet]);
```
- `setTweets((prev) => [...prev, newTweet])` makes a **new array** = old items + the
  new one. We never mutate the old array; React detects change by seeing a *new* array.
- Changing `tweets` state triggers a re-render → `TweetList` shows the new tweet.

### E) Saving + surviving refresh
- `HomePage` has `useEffect(() => saveTweets(tweets), [tweets])`.
- The `[tweets]` at the end is the **dependency array**: "run this effect whenever
  `tweets` changes." So every time the list changes, we write it to localStorage.
- On the next page load, step (A) reads it back with `loadTweets()`. That's why data
  persists across refresh.

---

## 4. Every function / value, explained

### `src/lib/constants.js`
- **`MAX_CHARS = 140`** — the tweet length limit. Kept in one place so there are no
  "magic numbers" scattered around. `CreateTweet` imports it.
- **`CURRENT_USER`** — the **default** username, used until the user changes it on the
  Profile page. Every new tweet is tagged with the current username.
- **`STORAGE_KEY`** — the string key used to store the tweets in localStorage.
- **`USER_STORAGE_KEY`** — the string key used to store the chosen username in localStorage.

### `src/lib/user.js`
- **`loadUsername()`** — reads the saved username from localStorage; if none is saved yet,
  falls back to `CURRENT_USER`. (`||` means "use the left value, or the right one if the
  left is empty/null".)
- **`saveUsername(name)`** — writes the username to localStorage so it survives refresh.
- *Why a separate lib file:* same idea as `storage.js` — keep persistence logic out of the
  components, in one reusable place.

### `src/lib/supabase.js`
- **`supabase`** — the Supabase client, created once with our project URL + anon key. Every
  data call (read/insert) goes through this. *(The anon key is public by design; our table
  has RLS disabled so it's fully read/write for this exercise.)*

### `src/lib/TweetsContext.jsx` → `TweetsProvider`, `useTweets`
This is the **shared box** for the tweets (React Context), now backed by Supabase.
- **`createContext(null)`** — makes the empty context object.
- **`TweetsProvider({ children })`** — holds the data and wraps the app. Inside it:
  - **`useState([])`** — the tweets list (starts empty, filled from the server).
  - **`loading`** — `true` until the first fetch finishes, so the UI can show "Loading…".
  - **`loadTweets()`** — `await supabase.from("Tweets").select("*")` reads all tweets from
    the server and stores them in state.
  - **`useEffect(..., [])`** — runs `loadTweets()` once on mount, then `setInterval(...5000)`
    re-fetches every 5s to catch tweets someone else added. `clearInterval` cleanup stops
    the timer when the provider unmounts.
  - **`addTweet(tweet)`** — `await supabase.from("Tweets").insert(tweet).select()` saves the
    new tweet to the server and gets it back (with its real `id`), then appends it to the
    existing list (`[...prev, data[0]]`) — no full refresh. Throws on error so the caller
    can show it.
  - **`<TweetsContext.Provider value={{ tweets, loading, addTweet }}>`** — exposes these to
    everything inside.
- **`useTweets()`** — a small custom hook = `useContext(TweetsContext)`.

### `src/components/Tweets.jsx` → `Tweet`
- **`Tweet({ tweet })`** — a presentational component. `{ tweet }` **destructures** the
  props into `userName`, `content`, and `date` (the columns from the Supabase table). It
  shows the username, the time (`new Date(date).toISOString()`), and the content. No state,
  no logic — pure display.

### `src/components/TweetList.jsx` → `TweetList`
- **`TweetList({ tweets })`** — receives the array as a prop.
- **`[...tweets].sort((a, b) => new Date(b.date) - new Date(a.date))`** — copies the array
  first so we don't mutate the original, then sorts **descending** by `date` (newest first).
  `new Date(...)` turns the ISO strings into comparable numbers.
- Renders `<Tweet key={tweet.id} ... />` for each. The **`key`** is the server's `id`, which
  helps React track which item is which across re-renders.
- If the list is empty it shows a friendly message instead of a blank screen.

### `src/components/CreateTweet.jsx` → `CreateTweet`
- **`CreateTweet({ onAddTweet, posting, error })`** — gets the submit callback plus two
  status props: `posting` (a request is in flight) and `error` (server error text, if any).
- **`const [text, setText] = useState("")`** — state for the draft text.
- **`isTooLong`** — `text.length > MAX_CHARS`. When true, the error pill shows and the button
  is disabled → blocks tweets over 140 chars.
- **`isEmpty`** — `text.trim().length === 0`. Used inside `handleSubmit` to stop blank tweets.
- **`handleSubmit(e)`** — `async`: prevents reload, guards against invalid input **and while
  `posting`** (so you can't double-submit), `await`s `onAddTweet(...)`, and only clears the
  box if it **succeeded** (so your text isn't lost on a server error).
- The button shows **"Posting…"** and is disabled while a request runs; the server `error`
  (if any) is shown in a red pill.

### `src/components/NavBar.jsx` → `NavBar`
- **`<nav className="navbar">`** — a semantic HTML container meaning "navigation". Styled
  by CSS to be a bar and made `position: sticky` so it stays at the top on every page.
- **`<NavLink to="/">` / `<NavLink to="/profile">`** — links from react-router. Clicking one
  switches the page **without reloading the browser**. `NavLink` auto-adds an `active` CSS
  class to the link of the page you're currently on (that's the highlighted one).

### `src/pages/HomePage.jsx` → `HomePage`
- **`HomePage({ username })`** — receives the current `username` as a prop from `App`.
- **`const { tweets, loading, addTweet } = useTweets()`** — reads the tweets, the loading
  flag, and the add function from context (they live in `TweetsProvider`).
- **`posting` / `error` state** — track whether a post is in flight and hold a server error.
- **`handleAddTweet(text)`** — `async`: sets `posting`, builds the tweet in the server's shape
  `{ content, userName, date }`, `await`s `addTweet(...)`, catches any error into `error`, and
  returns `true`/`false` so `CreateTweet` knows whether to clear the box.
- Shows **"Loading tweets…"** until the first fetch finishes, then the `TweetList`.

### `src/pages/ProfilePage.jsx` → `ProfilePage`
- **`ProfilePage({ username, onSave })`** — gets the current `username` (down) and an
  `onSave` callback (to report changes up).
- **`const [name, setName] = useState(username)`** — a **local draft** for the input box,
  seeded with the current username. Typing changes the draft, not the real saved username.
- **`handleSubmit(e)`** — on Save: prevents reload and calls `onSave(name.trim())`. The
  page doesn't save anything itself — it just tells `App` the new name.

### `src/App.jsx` → `App`
- **`App()`** — the root component. It now owns the shared `username` and sets up routing.
- **`const [username, setUsername] = useState(() => loadUsername())`** — the real username,
  loaded once from localStorage.
- **`updateUsername(name)`** — updates state **and** calls `saveUsername` to persist it.
  Passed to `ProfilePage` as `onSave`.
- **`<HashRouter> / <Routes> / <Route>`** — routing setup. Each `<Route>` maps a URL path
  to a page: `/` → `HomePage`, `/profile` → `ProfilePage`. `NavBar` sits outside `<Routes>`
  so it shows on every page. We use `HashRouter` (URLs contain `#`) so refreshing a page
  works on GitHub Pages.
- **`<TweetsProvider>`** — wraps the app so every page/component inside can reach the shared
  tweets via `useTweets()`.

---

## 5. The data shape (what a "tweet" is)
These are the columns of the Supabase `Tweets` table:
```js
tweet = {
  id: number,       // auto-generated by Supabase — used as React's list key
  content: string,  // the tweet text
  userName: string, // who posted it (the current username)
  date: string,     // ISO date string — used to sort newest-first
}
```

---

## 6. Mental model to remember
1. **State changes → React re-renders** the component (calls the function again).
2. **Props flow down, events flow up.**
3. **Never mutate** state directly; always pass a **new** value/array to the setter.
4. **`useEffect`** is for talking to the outside world (localStorage, network) *after*
   render, controlled by its dependency array.
