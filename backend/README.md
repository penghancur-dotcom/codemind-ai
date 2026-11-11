# CodeMind AI Backend (v0.3.1)

Backend Express ini menjadi perantara antara frontend CodeMind AI dan provider yang kompatibel dengan format OpenAI Chat Completions. API key hanya disimpan di server.

## Deploy Vercel
1. Push seluruh isi proyek ke repository GitHub.
2. Import repository di Vercel dan gunakan root directory repository.
3. Vercel mendeteksi `server.js` di root sebagai aplikasi Express.
4. Script `vercel-build` menyalin `index.html`, `css/`, `js/`, dan `pages/` ke `public/`. Vercel menyajikan file di `public/` melalui CDN.
5. Di Vercel Project Settings > Environment Variables, tambahkan:
   - `AI_BASE_URL` — base URL API provider (contoh default `https://api.openai.com/v1`)
   - `AI_MODEL` — nama model yang benar-benar tersedia pada provider
   - `AI_API_KEY` — secret API key provider
   - `FRONTEND_ORIGINS` — opsional; daftar origin frontend lain dipisahkan koma. Biarkan kosong untuk setup same-origin Vercel.
6. Deploy ulang setelah menambahkan atau mengubah Environment Variables.
7. Tes `https://domain-proyek.vercel.app/api/health`. `aiConfigured` harus `true` sebelum AI Chat bisa dipakai.

## Endpoint
- `GET /api/health` — status API dan status konfigurasi tanpa membocorkan key.
- `POST /api/chat` — menerima `{ "messages": [{"role":"user","content":"Halo"}] }`.

## Lokal (opsional)
- Prasyarat: Node.js 20 atau lebih baru.
- Jalankan `npm install` dari root proyek.
- Salin `backend/.env.example` menjadi `backend/.env` atau siapkan environment variables pada terminal.
- Jalankan `npm start` dari root proyek.
- Buka `http://localhost:3000` dan tes `/api/health`.

## Keamanan dan batasan
- Jangan pernah menaruh API key di HTML, JavaScript frontend, URL, atau repository publik.
- Jangan mengunggah file `.env`. Gunakan Environment Variables Vercel untuk deployment.
- Batas 20 request per menit menggunakan memory store; ini pembatasan awal, bukan kuota produksi yang terdistribusi. Tambahkan autentikasi, kuota per pengguna, pemantauan, dan proteksi abuse sebelum membuka layanan publik secara luas.
- Belum ada database, akun pengguna, sinkronisasi riwayat, maupun autentikasi.
- Provider harus mendukung endpoint `/chat/completions` dan respons `choices[0].message.content`. Provider dengan format berbeda memerlukan adapter.
- Acode tetap menjadi editor source. Deployment online dilakukan melalui GitHub dan Vercel; Preview Acode tidak menjalankan Node.js backend.
