# Readit — Frontend

A Reddit-like community board built with React.

---

## File Structure — What each file does

```
src/
│
├── config.js              ← ✏️ Your backend URL lives here
│
├── api/
│   └── index.js           ← ✏️ All backend API calls live here
│                              Add new API calls here when backend grows
│
├── pages/
│   └── Home.jsx           ← ✏️ The main page layout & logic
│                              Add new pages here (e.g. Profile.jsx)
│
├── components/
│   ├── Header.jsx         ← App title bar
│   ├── PostCard.jsx       ← ✏️ Single post — edit to show more fields
│   ├── TitleGroup.jsx     ← ✏️ One r/Title section — edit to add actions
│   ├── DeleteModal.jsx    ← Confirmation popup
│   └── Toast.jsx          ← Pop-up notifications (success/error)
│
└── styles/
    ├── global.css         ← ✏️ Colors, fonts, base elements
    └── app.css            ← ✏️ All component styles (clearly labelled)
```

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set your backend URL
#    Copy .env.example → .env and fill in your Render URL
#    OR edit src/config.js directly

# 3. Run locally
npm start
```

---

## How to add a new API endpoint

1. Open `src/api/index.js`
2. Add a new function at the bottom (copy any existing one as a template)
3. Export it
4. Import and use it in the page/component that needs it

---

## How to add a new page

1. Create `src/pages/YourPage.jsx`
2. Import it in `src/App.jsx`
3. Render it inside the `<div className="page">` block

---

## Deploying to Render

1. Push your code to GitHub
2. Render → New → Static Site
3. Root Directory: `frontend`
4. Build Command: `npm install && npm run build`
5. Publish Directory: `frontend/build`
6. Add environment variable: `REACT_APP_API_URL` = your backend URL
