/**
 * Alquranku — bookmark.js
 * Menampilkan dan mengelola daftar surat yang disimpan
 */

const API_SURAT_URL = "https://equran.id/api/v2/surat";

let dataSuratGlobal = [];

document.addEventListener("DOMContentLoaded", () => {
    perbaruiBadgeBookmark();
    memuatHalamanBookmark();
});

function memuatHalamanBookmark() {
    tampilkanLoading();

    fetch(API_SURAT_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Gagal memuat data: ${response.status}`);
            }
            return response.json();
        })
        .then(hasil => {
            if (hasil && hasil.data) {
                dataSuratGlobal = hasil.data;
                tampilkanDaftarBookmark(dataSuratGlobal);
            } else {
                throw new Error("Format data API tidak sesuai");
            }
        })
        .catch(error => {
            console.error("Kesalahan memuat bookmark:", error);
            tampilkanError("Gagal memuat data surat. Silakan periksa koneksi internet Anda.");
        })
        .finally(() => {
            hentikanLoading();
        });
}

function ambilDaftarBookmark() {
    try {
        const tersimpan = localStorage.getItem("bookmark");
        return tersimpan ? JSON.parse(tersimpan) : [];
    } catch (e) {
        console.error("Gagal membaca localStorage:", e);
        return [];
    }
}

function perbaruiBadgeBookmark() {
    const badge = document.getElementById("bookmarkCountBadge");
    if (badge) {
        const daftar = ambilDaftarBookmark();
        badge.textContent = daftar.length;
    }
}

function tampilkanDaftarBookmark(semuaSurat) {
    const kontainer = document.getElementById("daftarbookmark");
    if (!kontainer) return;

    kontainer.innerHTML = "";

    const daftarNomor = ambilDaftarBookmark();

    if (!daftarNomor || daftarNomor.length === 0) {
        kontainer.innerHTML = `
            <div class="empty-state-box">
                <div class="empty-state-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                    </svg>
                </div>
                <h2 class="empty-state-title">Belum Ada Bookmark</h2>
                <p class="empty-state-text">
                    Anda belum menyimpan surat apapun. Tandai surat favorit Anda di halaman utama agar mudah diakses kembali.
                </p>
                <a href="index.html" class="btn btn-primary" style="display: inline-flex;">
                    Jelajahi Surat
                </a>
            </div>
        `;
        return;
    }

    // Filter surat yang nomornya ada di bookmark
    const suratTersimpan = semuaSurat.filter(surat => daftarNomor.includes(surat.nomor));

    if (suratTersimpan.length === 0) {
        kontainer.innerHTML = `
            <div class="empty-state-box">
                <h2 class="empty-state-title">Data Surat Tidak Ditemukan</h2>
                <p class="empty-state-text">Surat yang Anda bookmark mungkin sudah tidak tersedia.</p>
                <a href="index.html" class="btn btn-primary">Kembali ke Beranda</a>
            </div>
        `;
        return;
    }

    let markup = "";
    for (let i = 0; i < suratTersimpan.length; i++) {
        const surat = suratTersimpan[i];
        const kelasTurun = surat.tempatTurun.toLowerCase() === "mekah" ? "turun-mekah" : "turun-madinah";

        markup += `
            <article class="surat-card">
                <div>
                    <div class="surat-card-header">
                        <div class="surat-number-badge" title="Nomor Surat ${surat.nomor}">
                            ${surat.nomor}
                        </div>
                        <div class="surat-card-info">
                            <h2 class="surat-nama-latin">${surat.namaLatin}</h2>
                            <p class="surat-arti">${surat.arti}</p>
                        </div>
                        <div class="surat-nama-arab" dir="rtl" lang="ar">
                            ${surat.nama}
                        </div>
                    </div>

                    <div class="surat-card-meta">
                        <span class="meta-pill ${kelasTurun}">
                            <span>📍</span> ${surat.tempatTurun}
                        </span>
                        <span class="meta-pill">
                            <span>📖</span> ${surat.jumlahAyat} Ayat
                        </span>
                    </div>

                    <p class="surat-card-deskripsi">${surat.deskripsi ? surat.deskripsi.replace(/<[^>]*>?/gm, '') : ''}</p>
                </div>

                <div class="surat-card-actions">
                    <button 
                        type="button" 
                        class="btn btn-danger-outline" 
                        onclick="hapusBookmark(${surat.nomor}, '${surat.namaLatin}')"
                        aria-label="Hapus ${surat.namaLatin} dari bookmark"
                        title="Hapus dari bookmark"
                    >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                        <span>Hapus</span>
                    </button>

                    <a href="baca.html?nomor=${surat.nomor}" class="btn btn-primary" aria-label="Baca surat ${surat.namaLatin}">
                        <span>Baca Surat</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                    </a>
                </div>
            </article>
        `;
    }

    kontainer.innerHTML = markup;
}

function hapusBookmark(nomor, namaLatin) {
    const bookmark = ambilDaftarBookmark();
    const index = bookmark.indexOf(nomor);

    if (index !== -1) {
        bookmark.splice(index, 1);
        localStorage.setItem("bookmark", JSON.stringify(bookmark));
        tampilkanToast(`Surat ${namaLatin || ''} dihapus dari bookmark`);
    }

    perbaruiBadgeBookmark();
    tampilkanDaftarBookmark(dataSuratGlobal);
}

function tampilkanLoading() {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.style.display = "flex";
        preloader.style.opacity = "1";
    }
}

function hentikanLoading() {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.style.opacity = "0";
        setTimeout(() => {
            preloader.style.display = "none";
        }, 250);
    }
}

function tampilkanError(pesan) {
    const kontainer = document.getElementById("daftarbookmark");
    if (!kontainer) return;

    kontainer.innerHTML = `
        <div class="empty-state-box">
            <h2 class="empty-state-title" style="color: var(--color-danger);">Terjadi Kesalahan</h2>
            <p class="empty-state-text">${pesan}</p>
            <button type="button" class="btn btn-primary" onclick="memuatHalamanBookmark()">
                Coba Lagi
            </button>
        </div>
    `;
}

function tampilkanToast(pesan) {
    let toast = document.getElementById("toastNotification");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toastNotification";
        toast.className = "toast-notification";
        document.body.appendChild(toast);
    }

    toast.textContent = pesan;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2800);
}
