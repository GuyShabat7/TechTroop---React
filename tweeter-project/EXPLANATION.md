# Tweeter — Code Explanation (study guide)

This document explains **how the app works** and **what each piece of React means**,
so you can understand the flow — not just what the code is.

---

## 1. The big picture — who owns what

React apps are a **tree of components**. Data flows **down** through props, and
events flow **up** through callback functions. In our app:

```
App
 └── HomePage            ← OWNS the data (the tweets array) + all the logic
      ├── CreateTweet    ← lets you type a tweet, tells HomePage "add this"
      └── TweetList      ← receives the tweets, shows them
           └── Tweet     ← shows ONE tweet
```

Key idea: **only `HomePage` holds the tweets in state.** The children don't own
data — they either *receive* it (TweetList/Tweet) or *report events* up
(CreateTweet). This pattern is called **"lifting state up"**: the state lives in
the closest common parent so everyone can share it.

- Data going **down** = **props** (e.g. `HomePage` passes `tweets` to `TweetList`).
- Events going **up** = **callback props** (e.g. `CreateTweet` calls `onAddTweet`,
  a function `HomePage` gave it).

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
- **`CURRENT_USER`** — a hard-coded username. Step 1 has no login, so every tweet you
  create is tagged with this. Later this will come from real auth.
- **`STORAGE_KEY`** — the string key used in localStorage. One name in one place, so
  load and save always agree.

### `src/lib/storage.js`
- **`loadTweets()`** — reads the raw string from localStorage, `JSON.parse`s it into an
  array, and returns it. Wrapped in `try/catch` returning `[]` so a missing or corrupt
  value can't crash the app. *Why a lib function:* keeps localStorage details out of the
  UI, and if we later switch to a server we only change this file.
- **`saveTweets(tweets)`** — turns the array into a string with `JSON.stringify` and
  writes it under `STORAGE_KEY`. (localStorage only stores strings, so we must stringify.)

### `src/components/Tweets.jsx` → `Tweet`
- **`Tweet({ tweet })`** — a presentational component. `{ tweet }` **destructures** the
  props, pulling out the single `tweet` object. It shows the `username`, the time
  (`new Date(createdAt).toISOString()` turns the number timestamp into an ISO string like
  `2019-12-15T14:40:58.340Z`), and the text. It has no state and no logic — pure display.

### `src/components/TweetList.jsx` → `TweetList`
- **`TweetList({ tweets })`** — receives the array as a prop.
- **`[...tweets].sort((a, b) => b.createdAt - a.createdAt)`** — copies the array first
  (`[...tweets]`) so we don't mutate the original, then sorts **descending** by timestamp
  → newest first. `b - a` = descending; `a - b` would be ascending.
- Renders `<Tweet key={tweet.id} ... />` for each. The **`key`** helps React track which
  item is which across re-renders (must be unique — that's why each tweet has an `id`).
- If the list is empty it shows a friendly message instead of a blank screen.

### `src/components/CreateTweet.jsx` → `CreateTweet`
- **`CreateTweet({ onAddTweet })`** — receives a callback from the parent.
- **`const [text, setText] = useState("")`** — state for the draft text. `text` is the
  current value; `setText` updates it. Starts empty.
- **`isTooLong`** — `text.length > MAX_CHARS`. When true, the error pill shows and the
  button's `disabled` attribute is set → this is how we **block** tweets over 140 chars.
- **`isEmpty`** — `text.trim().length === 0`. Used only inside `handleSubmit` to silently
  stop blank tweets (the button stays enabled, matching the design).
- **`handleSubmit(e)`** — runs on form submit: prevents page reload, guards against
  invalid input, calls `onAddTweet(text.trim())`, then clears the box.
- The **`<textarea>`** is controlled: `value={text}` + `onChange={...setText...}`.

### `src/pages/HomePage.jsx` → `HomePage`
- **`const [tweets, setTweets] = useState(() => loadTweets())`** — the app's real data.
  Passing a **function** to `useState` (a "lazy initializer") means `loadTweets()` runs
  only once, on first render, not on every render.
- **`useEffect(() => { saveTweets(tweets); }, [tweets])`** — auto-saves after every change
  to `tweets`.
- **`handleAddTweet(text)`** — builds a new tweet object and appends it to state
  (see section 3D).
- Renders the page: a title, `CreateTweet` (given `onAddTweet={handleAddTweet}`), and
  `TweetList` (given `tweets={tweets}`).

### `src/App.jsx` → `App`
- **`App()`** — the root component. Right now it just renders `HomePage`. Kept thin so we
  can add routing/layout around it later without touching the page logic.

---

## 5. The data shape (what a "tweet" is)
```js
tweet = {
  id: string,        // crypto.randomUUID(), unique — used as React's list key
  username: string,  // CURRENT_USER for now
  text: string,      // what you typed
  createdAt: number, // Date.now() — a timestamp, used to sort newest-first
}
```

---

## 6. Mental model to remember
1. **State changes → React re-renders** the component (calls the function again).
2. **Props flow down, events flow up.**
3. **Never mutate** state directly; always pass a **new** value/array to the setter.
4. **`useEffect`** is for talking to the outside world (localStorage, network) *after*
   render, controlled by its dependency array.
