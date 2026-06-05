# ResumeWise Genesis

A modern, full-stack web application for creating, editing, and managing professional resumes.
Users sign in, build multiple resume "blueprints" with a live preview across five templates,
auto-save everything to the cloud, and export print-ready PDFs.

> Built with React + Firebase. See [`TECHNICAL_SYNOPSIS.md`](./TECHNICAL_SYNOPSIS.md) for the full design write-up.

---

## Features

- **Authentication** — Email/password sign up & login (Firebase Auth), with protected routes.
- **Multi-resume dashboard** — Create, edit, duplicate, and delete multiple resume blueprints.
- **5-step editor** — Contacts, Experience, Education, Skills, and Finalize, with live split-screen preview.
- **Cloud auto-save** — Every change syncs to Cloud Firestore (per-user, isolated data).
- **5 templates** — Executive, Modernist, Creative, Simple, and Astraea.
- **Resume strength meter** — Visual completion score to guide users.
- **PDF export** — Print-to-PDF optimized for A4.
- **JSON backup** — Export resume data for safekeeping.
- **Resilient UX** — App-wide error boundary, 404 page, toasts, and skeleton loaders.

---

## Tech Stack

| Layer        | Technology                                  |
|--------------|---------------------------------------------|
| Frontend     | React 18, React Router 7, Framer Motion     |
| Styling      | Tailwind CSS 3, PostCSS                      |
| Backend      | Firebase Authentication, Cloud Firestore    |
| Build/Tooling| Create React App (react-scripts)            |
| Hosting      | Firebase Hosting (config included)          |

---

## Getting Started (Local Development)

### 1. Prerequisites
- [Node.js](https://nodejs.org/) 18+ and npm

### 2. Install dependencies
```bash
npm install
```
> **Behind a corporate network/antivirus?** If `npm install` fails with
> `UNABLE_TO_VERIFY_LEAF_SIGNATURE`, run `npm config set strict-ssl false`,
> install, then re-enable with `npm config set strict-ssl true`.

### 3. Configure environment variables
Copy the example file and fill in your Firebase project values:
```bash
cp .env.example .env
```
The keys come from **Firebase Console → Project Settings → General → Your apps → SDK setup**.
(The app ships with working fallback values, so it also runs without a `.env`.)

### 4. Run the dev server
```bash
npm start
```
Open [http://localhost:3000](http://localhost:3000).

---

## Available Scripts

| Command          | Description                                            |
|------------------|--------------------------------------------------------|
| `npm start`      | Run the dev server with hot reload at `localhost:3000` |
| `npm run build`  | Produce an optimized production build in `build/`       |
| `npm test`       | Run the test runner                                    |

---

## Project Structure

```
src/
├── App.js                  # Routes (public, protected, 404 catch-all)
├── index.js                # Entry point, wraps app in ErrorBoundary
├── LandingPage.js          # Marketing/home page
├── TemplateSelector.js     # Template picker before editing
├── Editor.js               # 5-step resume editor + live preview + autosave
├── components/
│   ├── Dashboard.js        # Multi-resume management
│   ├── Navbar.js
│   ├── RequireAuth.js      # Route guard
│   ├── ErrorBoundary.js    # App-wide crash recovery
│   ├── Toast.js
│   └── SkeletonLoader.js
├── context/
│   └── AuthContext.js      # Global auth state
├── lib/
│   └── firebase.js         # Firebase init (env-driven)
├── pages/
│   ├── Login.js
│   ├── Signup.js
│   ├── AccountSettings.js
│   └── NotFound.js         # 404 page
├── services/
│   ├── resumeService.js    # Firestore CRUD for blueprints
│   └── userService.js      # Firestore CRUD for user profiles
└── temp_folder/            # The 5 resume templates
```

---

## Data Model (Cloud Firestore)

```
users/{uid}                          # user profile
users/{uid}/blueprints/{blueprintId} # one resume per document
  ├── template   (string)
  ├── data       (object: contacts, experience, education, skills, ...)
  └── metadata   (name, status, timestamps)
```

Access is restricted so each user can only read/write their own data — see
[`firestore.rules`](./firestore.rules).

---

## Deployment (Firebase Hosting)

```bash
npm run build                 # build the app
npm install -g firebase-tools # one-time
firebase login
firebase deploy               # deploys hosting + Firestore security rules
```
Hosting, SPA rewrites, and security-rules deployment are pre-configured in
[`firebase.json`](./firebase.json) and [`.firebaserc`](./.firebaserc).

---

## Security Notes

- Firebase **web** API keys are not secrets; they identify the project. Real protection
  comes from **Firestore Security Rules** (`firestore.rules`), which restrict every user
  to their own data.
- Configuration is read from `.env` (git-ignored); `.env.example` documents the required keys.
