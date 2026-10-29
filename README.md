# 🕌 Alquranku

**Alquranku** adalah website Al-Qur'an digital yang dirancang untuk membantu pengguna menjelajahi daftar surat, mencari surat dengan mudah, membaca ayat, dan menyimpan surat favorit melalui fitur bookmark.

## ✨ Fitur

- 📖 **Daftar surat Al-Qur'an** — menampilkan nama Arab, nama Latin, arti, tempat diturunkan, dan jumlah ayat.
- 🔎 **Pencarian surat** — mencari berdasarkan nama, arti, atau nomor surat.
- 📚 **Halaman baca surat** — membuka surat yang ingin dibaca.
- 🔖 **Bookmark** — menyimpan surat favorit agar mudah ditemukan kembali.
- 💾 **Penyimpanan lokal** — bookmark disimpan di browser menggunakan `localStorage`.
- 📱 **Desain responsif** — dirancang untuk berbagai ukuran layar.
- ⏳ **Loading dan error handling** — memberikan informasi saat data sedang dimuat atau terjadi kendala.

## 🛠️ Teknologi

- HTML5
- CSS3
- JavaScript
- [EQuran.id API](https://equran.id/apidev)
- Google Fonts: Amiri dan Plus Jakarta Sans

## 🚀 Cara Menjalankan

Project ini menggunakan HTML, CSS, dan JavaScript biasa, sehingga tidak memerlukan proses build.

1. Clone repository:

   ```bash
   git clone https://github.com/ghaisankhazini7-star/Al-quranku.git
   ```

2. Masuk ke folder project:

   ```bash
   cd Al-quranku
   ```

3. Buka folder project di VS Code:

   ```bash
   code .
   ```

4. Jalankan `index.html` menggunakan extension **Live Server** atau buka langsung di browser.

> **Catatan:** Koneksi internet diperlukan untuk mengambil data surat dari API dan memuat font Google Fonts.

## 📂 Struktur Project

```text
Al-quranku/
├── index.html
├── baca.html
├── bookmark.html
├── style.css
├── script.js
└── bookmark.js
```

- `index.html` — halaman utama dan daftar surat.
- `baca.html` — halaman membaca surat.
- `bookmark.html` — halaman surat yang disimpan.
- `style.css` — mengatur tampilan website.
- `script.js` — mengatur daftar surat, pencarian, dan bookmark.
- `bookmark.js` — mengatur halaman bookmark.

## 🔖 Penyimpanan Bookmark

Bookmark disimpan menggunakan `localStorage` pada browser. Data tersebut tersimpan secara lokal di perangkat dan browser yang digunakan, sehingga tidak otomatis tersinkronisasi dengan perangkat lain.

## 🌐 Sumber Data

Data surat diperoleh melalui [EQuran.id API](https://equran.id/apidev). Penggunaan fitur yang membutuhkan data API bergantung pada ketersediaan layanan dan koneksi internet.

## 🤝 Kontribusi

Saran, laporan bug, dan ide pengembangan sangat terbuka. Kamu dapat membuat **Issue** atau mengajukan **Pull Request** melalui repository ini.

## 📄 Lisensi

Belum ada lisensi yang ditentukan. Jika project ingin dibagikan atau digunakan ulang oleh orang lain, pertimbangkan untuk menambahkan file lisensi yang sesuai.

---

Dibuat dengan semangat untuk menghadirkan pengalaman membaca Al-Qur'an digital yang nyaman. 🤍
