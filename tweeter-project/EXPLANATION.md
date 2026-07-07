# Tweeter — Code Explanation (study guide)

This document explains **how the app works** and **what each piece of React means**,
so you can understand the flow — not just what the code is.

---

## 1. The big picture — who owns what

React apps are a **tree of components**. Data flows **down** through props, and
events flow **up** through callback functions. In our app:

```
App                         ← OWNS the username + sets up routing
 ├── NavBar                 ← Home / Profile links, sticky at the top
 └── (routes)
      ├── HomePage          ← OWNS the tweets array; gets username as a prop
      │    ├── CreateTweet  ← lets you type a tweet, tells HomePage "add this"
      │    └── TweetList    ← receives the tweets, shows them
      │         └── Tweet   ← shows ONE tweet
      └── ProfilePage       ← edits the username, reports it up to App
```

Key idea: **state lives in the closest common parent** ("lifting state up").
- The **tweets** are only needed by Home, so `HomePage` owns them.
- The **username** is needed by BOTH pages (Profile edits it, Home stamps it on
  tweets), so their common parent `App` owns it.

Children don't own shared data — they either *receive* it (props) or *report
events* up (callback props).

- Data going **down** = **props** (e.g. `App` passes `username` to `HomePage`).
- Events going **up** = **callback props** (e.g. `ProfilePage` calls `onSave`,
  a function `App` gave it).

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

### `src/components/NavBar.jsx` → `NavBar`
- **`<nav className="navbar">`** — a semantic HTML container meaning "navigation". Styled
  by CSS to be a bar and made `position: sticky` so it stays at the top on every page.
- **`<NavLink to="/">` / `<NavLink to="/profile">`** — links from react-router. Clicking one
  switches the page **without reloading the browser**. `NavLink` auto-adds an `active` CSS
  class to the link of the page you're currently on (that's the highlighted one).

### `src/pages/HomePage.jsx` → `HomePage`
- **`HomePage({ username })`** — now receives the current `username` as a prop from `App`.
- **`const [tweets, setTweets] = useState(() => loadTweets())`** — the app's tweet data.
  Passing a **function** to `useState` (a "lazy initializer") means `loadTweets()` runs
  only once, on first render, not on every render.
- **`useEffect(() => { saveTweets(tweets); }, [tweets])`** — auto-saves after every change
  to `tweets`.
- **`handleAddTweet(text)`** — builds a new tweet object (stamping the `username` prop) and
  appends it to state (see section 3D).

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
- **`<BrowserRouter> / <Routes> / <Route>`** — routing setup. Each `<Route>` maps a URL path
  to a page: `/` → `HomePage`, `/profile` → `ProfilePage`. `NavBar` sits outside `<Routes>`
  so it shows on every page.

---

## 5. The data shape (what a "tweet" is)
```js
tweet = {
  id: string,        // crypto.randomUUID(), unique — used as React's list key
  username: string,  // the current username (editable on the Profile page)
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
