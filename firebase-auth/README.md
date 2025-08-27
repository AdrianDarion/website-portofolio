Firebase Auth Widget for GitHub Pages

This is a drop‑in authentication widget (Email/Password + Google) that runs entirely on the client using Firebase Authentication. It works on static sites like GitHub Pages.

Contents
- `auth.js`: ES module that renders the auth UI and wires Firebase Auth
- `auth.css`: Scoped styles for the widget
- `firebase-config.sample.js`: Template for your Firebase web config
- `example.html`: Minimal example page showing integration

Prerequisites
1) Create a Firebase project (Console)
2) Add a Web App to get your web config (apiKey, authDomain, etc.)
3) Enable Authentication providers:
   - Email/Password
   - Google (optional but supported)
4) Add authorized domains in Firebase Auth settings:
   - adriandarion.github.io
   - localhost

Setup
1) Copy folder
   Copy the entire `firebase-auth` folder into your website repo. For GitHub Pages at `adriandarion.github.io/website-portofolio`, you can place it at the repo root or inside the site folder. Paths below assume `/website-portofolio/firebase-auth/`.

2) Create config file
   - Duplicate `firebase-config.sample.js` and name it `firebase-config.js`
   - Paste your Firebase web config inside it

3) Include on your page(s)
   - Add a container where the widget can mount:
     <div id="auth-root"></div>

   - Include CSS and JS (as ES modules). Adjust the paths to match your repo structure:
     <link rel="stylesheet" href="/website-portofolio/firebase-auth/auth.css">
     <script type="module">
       import { initFirebaseAuthWidget } from "/website-portofolio/firebase-auth/auth.js";
       import firebaseConfig from "/website-portofolio/firebase-auth/firebase-config.js";

       initFirebaseAuthWidget({ firebaseConfig, mountId: "auth-root" });
     </script>

   If your site is served from a subfolder, use relative paths like `./firebase-auth/auth.css` based on your file location.

What it provides
- Sign up with name, email, password
- Sign in with email/password
- Sign in with Google (popup)
- Password reset email
- Auth state awareness: shows a user chip with avatar/initials and a dropdown to sign out
- Local persistence: stays signed in across page reloads

Styling and placement
- The widget is scoped under `.auth-widget` and uses fixed positioning for the open button and user chip in the top-right. You can override positions via CSS if needed.

Security notes
- This is client-only auth. For protecting data or performing privileged actions, use Firebase Security Rules (for Firestore/Storage) or server-side code (e.g., Cloud Functions) that validates Firebase ID tokens.

Local testing
- Open `example.html` with a local web server (modules require http). For quick testing:
  - python3 -m http.server 8080
  - Then visit http://localhost:8080/firebase-auth/example.html

Troubleshooting
- If Google sign-in is blocked, ensure `adriandarion.github.io` and `localhost` are in Authorized Domains
- Ensure Email/Password provider is enabled in Firebase Auth
- Check your `firebase-config.js` values are correct

License
- MIT

