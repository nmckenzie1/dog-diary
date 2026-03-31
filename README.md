# Dog Log

Track your hot dog dominance.

Dog Log is a mobile-first Next.js app where users log each hot dog with required photo proof, then compete on a yearly leaderboard.

## MVP Features

- Firebase Authentication (Google + optional email/password)
- Profile creation on first login
- Log submission with required image proof
- Firebase Storage uploads at `dog-photos/{userId}/{year}/{logId}.jpg`
- Firestore-backed dashboard totals and recent activity
- Yearly leaderboard with tie-break ordering
- Recharts cumulative progress chart

## Tech Stack

- Next.js App Router + TypeScript
- Tailwind CSS
- Firebase Auth + Firestore + Storage
- Recharts
- Sonner toasts

## Routes

- `/` landing page
- `/login` sign in / sign up
- `/dashboard` authenticated dashboard
- `/log` hot dog submission form
- `/leaderboard` public yearly leaderboard
- `/profile` user profile and log history

## Local Setup

1. Install dependencies.
2. Create a `.env.local` from `.env.example`.
3. Add your Firebase web app config values.
4. Start the dev server.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Then open `http://localhost:3000`.

## Environment Variables

Set these in `.env.local`:

```dotenv
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

## Firebase Rules and Indexes

- Firestore rules: `firestore.rules`
- Storage rules: `storage.rules`
- Firestore indexes: `firestore.indexes.json`
- Firebase config: `firebase.json`

Deploy them with Firebase CLI after setting your project in `.firebaserc`.

## Validation

Run lint and production build:

```bash
npm run lint
npm run build
```

## Deployment Next Steps (Vercel + Firebase)

1. Create Firebase project services (Auth, Firestore, Storage).
2. Enable Google sign-in provider in Firebase Auth.
3. Deploy Firestore/Storage rules and indexes:

```bash
npm install -g firebase-tools
firebase login
firebase use <your-project-id>
firebase deploy --only firestore:rules,firestore:indexes,storage
```

4. Create a Vercel project from this repo.
5. Add all `NEXT_PUBLIC_FIREBASE_*` env vars in Vercel project settings.
6. Deploy and verify auth, uploads, dashboard, and leaderboard in production.
