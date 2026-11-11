# CodeMind AI — v0.3.1 Vercel Ready

**Your Intelligent Developer Workspace** — frontend MVP dengan backend Express yang disiapkan untuk deployment Vercel.

## Yang sudah tersedia
- Dashboard, navigasi, dan halaman workspace dengan desain dark navy + emerald yang dipertahankan.
- Playground HTML/CSS/JavaScript dengan preview iframe sandbox.
- Project Structure Generator.
- JSON, HTML, CSS, dan JavaScript formatter dasar.
- Regex Tester.
- History dan Settings lokal menggunakan localStorage.
- Backend Express untuk AI Chat melalui provider yang kompatibel dengan OpenAI Chat Completions.
- Endpoint `GET /api/health` dan `POST /api/chat`.
- Konfigurasi deployment Vercel dan proses penyalinan aset frontend ke `public/`.

## Batasan yang perlu diketahui
- AI Chat baru aktif setelah proyek di-deploy dan Environment Variables provider diisi dengan benar.
- Code Generator, Code Explainer, dan AI Debugger masih memakai fungsi lokal/heuristik; belum terhubung ke model AI.
- Belum ada database, autentikasi, akun pengguna, atau sinkronisasi cloud.
- Formatter dan debugger adalah alat dasar, bukan parser atau linter profesional.
- Rate limit MVP memakai memory store; belum cukup sebagai proteksi abuse untuk layanan publik berskala besar.

## Struktur utama
- `index.html` — dashboard.
- `css/styles.css` — design system dan style workspace.
- `js/app.js` — interaksi dashboard.
- `js/workspace.js` — logika halaman fitur dan pemanggilan AI Chat.
- `pages/` — halaman AI Workspace, Developer Tools, Playground, Project Tools, Documentation, History, dan Settings.
- `backend/app.js` — Express API yang diekspor ke Vercel.
- `backend/server.js` — server lokal Node.js.
- `server.js` — entrypoint Express root yang dikenali Vercel.
- `scripts/prepare-vercel.js` — menyalin source frontend ke `public/` saat build.
- `backend/.env.example` — contoh environment lokal.

## Mengedit dengan Acode
1. Ekstrak ZIP dan buka folder proyek di Acode.
2. Edit file source di root (`index.html`, `css/`, `js/`, dan `pages/`).
3. Preview Acode tetap dapat digunakan untuk memeriksa tampilan frontend. Endpoint AI tidak akan aktif pada preview lokal tanpa backend yang berjalan.
4. Saat source siap, upload seluruh proyek ke repository GitHub untuk deployment Vercel.

## Deploy ke Vercel
1. Upload seluruh isi folder proyek ke repository GitHub.
2. Import repository di Vercel dan gunakan root directory repository (folder yang berisi `package.json` dan `server.js`).
3. Vercel mendeteksi aplikasi Express dari `server.js`. Script `vercel-build` menyalin source frontend ke `public/`, yang disajikan Vercel melalui CDN.
4. Pada Project Settings → Environment Variables, tambahkan:
   - `AI_BASE_URL` — base URL API provider, contoh default `https://api.openai.com/v1`.
   - `AI_MODEL` — nama model yang benar-benar tersedia pada provider.
   - `AI_API_KEY` — secret API key provider.
   - `FRONTEND_ORIGINS` — opsional, untuk frontend pada domain terpisah; pisahkan beberapa origin dengan koma. Biarkan kosong untuk frontend dan API pada domain Vercel yang sama.
5. Deploy. Setelah mengubah Environment Variables, lakukan redeploy.
6. Tes `https://domain-proyek.vercel.app/api/health`. `aiConfigured` harus `true` jika konfigurasi provider sudah lengkap.

**Keamanan:** jangan menaruh API key di HTML, JavaScript frontend, URL, atau repository. Jangan mengunggah file `.env`. Gunakan Environment Variables di hosting. Jika akun provider atau pembayaran memerlukan persetujuan orang dewasa, minta orang tua/wali atau orang dewasa tepercaya mengurus bagian akun dan billing.

## Lokal (opsional)
Memerlukan Node.js 20+. Dari root proyek, jalankan `npm install`, salin `backend/.env.example` ke `backend/.env`, isi konfigurasi provider, lalu jalankan `npm start`. Buka `http://localhost:3000`. Acode adalah editor dan tidak menjalankan proses Node.js backend.
