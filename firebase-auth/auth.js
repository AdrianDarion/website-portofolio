// Firebase Auth widget for static sites (GitHub Pages)
// Usage:
//   import { initFirebaseAuthWidget } from './auth.js'
//   import firebaseConfig from './firebase-config.js'
//   initFirebaseAuthWidget({ firebaseConfig, mountId: 'auth-root' })

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js';
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  signOut,
  updateProfile
} from 'https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js';

function createElement(tagName, options = {}) {
  const element = document.createElement(tagName);
  if (options.className) element.className = options.className;
  if (options.text) element.textContent = options.text;
  if (options.html) element.innerHTML = options.html;
  if (options.attrs) {
    Object.entries(options.attrs).forEach(([key, value]) => {
      if (value !== undefined && value !== null) element.setAttribute(key, String(value));
    });
  }
  return element;
}

function getDisplayInitials(displayName, email) {
  const basis = displayName || email || '';
  const parts = basis.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function preventDefault(handler) {
  return (event) => {
    event.preventDefault();
    handler(event);
  };
}

export function initFirebaseAuthWidget({ firebaseConfig, mountId = 'auth-root' } = {}) {
  if (!firebaseConfig) throw new Error('firebaseConfig is required');
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  setPersistence(auth, browserLocalPersistence).catch(() => {});

  const mount = document.getElementById(mountId);
  if (!mount) throw new Error(`Mount element #${mountId} not found`);

  const root = createElement('div', { className: 'auth-widget' });
  mount.appendChild(root);

  // Floating open button (visible when signed out)
  const openBtn = createElement('button', { className: 'auth-open-btn', text: 'Sign in' });
  root.appendChild(openBtn);

  // User chip (visible when signed in)
  const userChip = createElement('div', { className: 'auth-userchip' });
  const avatar = createElement('div', { className: 'auth-avatar' });
  const username = createElement('div', { className: 'auth-username' });
  const menuBtn = createElement('button', { className: 'auth-menu-btn', text: '⋯' });
  const menu = createElement('div', { className: 'auth-menu' });
  const signoutBtn = createElement('button', { text: 'Sign out' });
  menu.appendChild(signoutBtn);
  userChip.appendChild(avatar);
  userChip.appendChild(username);
  userChip.appendChild(menuBtn);
  userChip.appendChild(menu);
  root.appendChild(userChip);

  // Overlay + modal
  const overlay = createElement('div', { className: 'auth-overlay' });
  const modal = createElement('div', { className: 'auth-modal' });
  const modalHeader = createElement('div', { className: 'auth-modal-header' });
  const modalTitle = createElement('div', { className: 'auth-modal-title', text: 'Welcome' });
  const closeBtn = createElement('button', { className: 'auth-close-btn', text: '✕', attrs: { 'aria-label': 'Close' } });
  modalHeader.appendChild(modalTitle);
  modalHeader.appendChild(closeBtn);

  const tabs = createElement('div', { className: 'auth-tabs' });
  const tabSignIn = createElement('button', { className: 'auth-tab active', text: 'Sign in' });
  const tabSignUp = createElement('button', { className: 'auth-tab', text: 'Sign up' });
  tabs.appendChild(tabSignIn);
  tabs.appendChild(tabSignUp);

  const body = createElement('div', { className: 'auth-body' });

  // Sign in form
  const signInForm = createElement('form');
  const siEmail = createElement('div', { className: 'auth-field', html: '<label>Email</label>' });
  const siEmailInput = createElement('input', { attrs: { type: 'email', required: 'true', autocomplete: 'email', placeholder: 'you@example.com' } });
  siEmail.appendChild(siEmailInput);
  const siPass = createElement('div', { className: 'auth-field', html: '<label>Password</label>' });
  const siPassInput = createElement('input', { attrs: { type: 'password', required: 'true', autocomplete: 'current-password', placeholder: '••••••••' } });
  siPass.appendChild(siPassInput);
  const siRow = createElement('div', { className: 'auth-row' });
  const siForgot = createElement('button', { className: 'auth-link', text: 'Forgot password?' });
  siRow.appendChild(createElement('div'));
  siRow.appendChild(siForgot);
  const siSubmit = createElement('button', { className: 'auth-primary', text: 'Sign in', attrs: { type: 'submit' } });
  const siOr = createElement('div', { html: '<div style="text-align:center;margin:10px 0;color:#6b7280;font-size:12px;">OR</div>' });
  const siGoogle = createElement('button', { className: 'auth-google', html: '<svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.6 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.9-9 19.9-20 0-1.3-.1-2.7-.3-3.9z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16.1 4 9.2 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.6-5.3l-6.3-5.2C29.3 36 26.8 37 24 37c-5.3 0-9.7-3.6-11.3-8.5l-6.5 5C9.2 39.7 16 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1.3 3.9-5.2 7-9.3 7-5.3 0-9.7-3.6-11.3-8.5l-6.5 5C9.2 39.7 16 44 24 44c11 0 19.9-9 19.9-20 0-1.3-.1-2.7-.3-3.9z"/></svg> Continue with Google' });
  const siError = createElement('div', { className: 'auth-error' });
  const siSuccess = createElement('div', { className: 'auth-success' });
  signInForm.appendChild(siEmail);
  signInForm.appendChild(siPass);
  signInForm.appendChild(siRow);
  signInForm.appendChild(siSubmit);
  signInForm.appendChild(siOr);
  signInForm.appendChild(siGoogle);
  signInForm.appendChild(siError);
  signInForm.appendChild(siSuccess);

  // Sign up form
  const signUpForm = createElement('form');
  const suName = createElement('div', { className: 'auth-field', html: '<label>Name</label>' });
  const suNameInput = createElement('input', { attrs: { type: 'text', required: 'true', autocomplete: 'name', placeholder: 'Your name' } });
  suName.appendChild(suNameInput);
  const suEmail = createElement('div', { className: 'auth-field', html: '<label>Email</label>' });
  const suEmailInput = createElement('input', { attrs: { type: 'email', required: 'true', autocomplete: 'email', placeholder: 'you@example.com' } });
  suEmail.appendChild(suEmailInput);
  const suPass = createElement('div', { className: 'auth-field', html: '<label>Password</label>' });
  const suPassInput = createElement('input', { attrs: { type: 'password', required: 'true', autocomplete: 'new-password', placeholder: 'At least 6 characters' } });
  suPass.appendChild(suPassInput);
  const suPass2 = createElement('div', { className: 'auth-field', html: '<label>Confirm password</label>' });
  const suPass2Input = createElement('input', { attrs: { type: 'password', required: 'true', autocomplete: 'new-password', placeholder: 'Repeat password' } });
  suPass2.appendChild(suPass2Input);
  const suSubmit = createElement('button', { className: 'auth-primary', text: 'Create account', attrs: { type: 'submit' } });
  const suError = createElement('div', { className: 'auth-error' });
  const suSuccess = createElement('div', { className: 'auth-success' });
  signUpForm.appendChild(suName);
  signUpForm.appendChild(suEmail);
  signUpForm.appendChild(suPass);
  signUpForm.appendChild(suPass2);
  signUpForm.appendChild(suSubmit);
  signUpForm.appendChild(suError);
  signUpForm.appendChild(suSuccess);

  // Modal content assembly
  body.appendChild(signInForm);
  body.appendChild(signUpForm);
  signUpForm.style.display = 'none';
  modal.appendChild(modalHeader);
  modal.appendChild(tabs);
  modal.appendChild(body);
  overlay.appendChild(modal);
  root.appendChild(overlay);

  // UI helpers
  function openModal() {
    overlay.classList.add('open');
    siError.textContent = '';
    suError.textContent = '';
    siSuccess.textContent = '';
    suSuccess.textContent = '';
  }
  function closeModal() { overlay.classList.remove('open'); }
  function showMenu(open) { if (open) menu.classList.add('open'); else menu.classList.remove('open'); }
  function switchTab(which) {
    if (which === 'in') {
      tabSignIn.classList.add('active');
      tabSignUp.classList.remove('active');
      signInForm.style.display = '';
      signUpForm.style.display = 'none';
      modalTitle.textContent = 'Sign in';
    } else {
      tabSignIn.classList.remove('active');
      tabSignUp.classList.add('active');
      signInForm.style.display = 'none';
      signUpForm.style.display = '';
      modalTitle.textContent = 'Create your account';
    }
  }

  // Events
  openBtn.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
  tabSignIn.addEventListener('click', () => switchTab('in'));
  tabSignUp.addEventListener('click', () => switchTab('up'));
  menuBtn.addEventListener('click', () => { menu.classList.toggle('open'); });
  document.addEventListener('click', (e) => {
    if (!userChip.contains(e.target)) showMenu(false);
  });

  signoutBtn.addEventListener('click', async () => {
    showMenu(false);
    try { await signOut(auth); } catch (_) {}
  });

  siForgot.addEventListener('click', preventDefault(async () => {
    siError.textContent = '';
    siSuccess.textContent = '';
    const email = siEmailInput.value.trim();
    if (!email) { siError.textContent = 'Enter your email first.'; return; }
    try {
      await sendPasswordResetEmail(auth, email);
      siSuccess.textContent = 'Reset link sent. Check your inbox.';
    } catch (err) {
      siError.textContent = normalizeError(err);
    }
  }));

  signInForm.addEventListener('submit', preventDefault(async () => {
    siError.textContent = '';
    siSuccess.textContent = '';
    const email = siEmailInput.value.trim();
    const password = siPassInput.value;
    if (!email || !password) { siError.textContent = 'Email and password are required.'; return; }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      closeModal();
    } catch (err) {
      siError.textContent = normalizeError(err);
    }
  }));

  const googleProvider = new GoogleAuthProvider();
  siGoogle.addEventListener('click', preventDefault(async () => {
    siError.textContent = '';
    try {
      await signInWithPopup(auth, googleProvider);
      closeModal();
    } catch (err) {
      siError.textContent = normalizeError(err);
    }
  }));

  signUpForm.addEventListener('submit', preventDefault(async () => {
    suError.textContent = '';
    suSuccess.textContent = '';
    const name = suNameInput.value.trim();
    const email = suEmailInput.value.trim();
    const password = suPassInput.value;
    const password2 = suPass2Input.value;
    if (!name) { suError.textContent = 'Name is required.'; return; }
    if (!email) { suError.textContent = 'Email is required.'; return; }
    if (!password || password.length < 6) { suError.textContent = 'Password must be at least 6 characters.'; return; }
    if (password !== password2) { suError.textContent = 'Passwords do not match.'; return; }
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(credential.user, { displayName: name });
      suSuccess.textContent = 'Account created.';
      closeModal();
    } catch (err) {
      suError.textContent = normalizeError(err);
    }
  }));

  // Auth state
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const displayName = user.displayName || user.email || 'User';
      const initials = getDisplayInitials(user.displayName, user.email);
      username.textContent = displayName;
      // Reset avatar contents
      avatar.innerHTML = '';
      if (user.photoURL) {
        const img = createElement('img', { attrs: { src: user.photoURL, alt: 'Avatar', referrerpolicy: 'no-referrer' } });
        img.style.width = '100%'; img.style.height = '100%'; img.style.objectFit = 'cover';
        avatar.appendChild(img);
      } else {
        avatar.textContent = initials;
      }
      openBtn.style.display = 'none';
      userChip.style.display = 'flex';
    } else {
      openBtn.style.display = '';
      userChip.style.display = 'none';
    }
  });
}

function normalizeError(err) {
  const message = (err && err.code) || err?.message || String(err);
  if (typeof message !== 'string') return 'Something went wrong.';
  if (message.includes('auth/invalid-email')) return 'Invalid email address.';
  if (message.includes('auth/missing-password')) return 'Password is required.';
  if (message.includes('auth/weak-password')) return 'Password should be at least 6 characters.';
  if (message.includes('auth/email-already-in-use')) return 'Email already in use.';
  if (message.includes('auth/invalid-credential')) return 'Invalid credentials.';
  if (message.includes('auth/too-many-requests')) return 'Too many attempts. Try again later.';
  if (message.includes('auth/popup-closed-by-user')) return 'Popup closed before completing sign in.';
  return message.replace(/^Firebase: | \(.*\)\.?$/g, '').trim() || 'Authentication error.';
}

