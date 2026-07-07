# Tweeter

A small Twitter clone built with React + Vite as a learning project.

## Live site

**https://guyshabat7.github.io/TechTroop---React/**

## Features

- Create tweets with a 140-character limit (button disabled + error message when over the limit)
- Tweets list sorted newest-first, persisted in `localStorage` (survives refresh)
- Profile page to change the username (saved locally, stamped on new tweets)
- Sticky navbar with Home / Profile links (React Router, `HashRouter`)
- Tweets shared app-wide via React Context, with a 5s interval that re-syncs the list

## Getting started

```bash
npm install     # install dependencies
npm run dev     # start the dev server (http://localhost:5173)
npm run build   # production build into dist/
npm run preview # preview the production build locally
```

## Deployment (GitHub Pages)

The app is deployed to GitHub Pages with the [`gh-pages`](https://www.npmjs.com/package/gh-pages) package.

```bash
npm run deploy
```

This builds the app and pushes `dist/` to the `gh-pages` branch. Notes:

- `vite.config.js` sets `base: "/TechTroop---React/"` so asset paths resolve under the repo path.
- `HashRouter` is used so page refreshes work on GitHub Pages (no server-side routing needed).
- To update the live site after code changes: commit & push to `main`, then run `npm run deploy`.

## Project structure

```
src/
  components/   reusable UI pieces (Tweets, TweetList, CreateTweet, NavBar)
  pages/        full screens (HomePage, ProfilePage)
  lib/          reusable non-UI logic (constants, storage, user, TweetsContext)
```

See `EXPLANATION.md` for a detailed walkthrough of how the code works.
