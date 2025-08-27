Website Portofolio + Firebase Auth (Client-only)

Cara menjalankan fitur Login/Sign Up di GitHub Pages:

1) Buat project Firebase
   - Buka Firebase Console, buat Project baru
   - Tambah Web App untuk mendapatkan konfigurasi Web (apiKey, authDomain, projectId, appId, dll)

2) Aktifkan provider Auth
   - Authentication > Sign-in method
   - Enable Email/Password
   - Optional: Enable Google
   - Authorized domains: tambahkan `adriandarion.github.io` dan `localhost`

3) Isi konfigurasi Firebase
   - File: `firebase-auth/firebase-config.js`
   - Ganti nilai `YOUR_API_KEY`, `YOUR_PROJECT_ID`, dst dengan config dari Firebase Console

4) Integrasi di halaman
   - Sudah terpasang di `iindex.html`:
     - Menyertakan `./firebase-auth/auth.css`
     - Menambahkan `<div id="auth-root"></div>`
     - Memanggil widget via ES module:
       `initFirebaseAuthWidget({ firebaseConfig, mountId: 'auth-root' });`

5) Deploy
   - Commit dan push ke GitHub. GitHub Pages akan otomatis memperbarui situs.

Catatan
- Widget menampilkan tombol "Sign in" mengambang (floating). Setelah login, muncul user chip dengan menu Sign out.
- Reset password tersedia di tab Sign in (Forgot password?).
- Jika ingin mengunci bagian/halaman tertentu, beri tahu kami bagian mana; kami bisa menambahkan guard berbasis status login.
