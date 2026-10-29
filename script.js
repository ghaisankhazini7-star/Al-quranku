/**
 * Alquranku — script.js
 * Pengambilan data surat, pencarian, dan pengelolaan bookmark
 */

const API_SURAT_URL = "https://equran.id/api/v2/surat";

let dataSurat = [];

// Inisialisasi
document.addEventListener("DOMContentLoaded", () => {
    perbaruiBadgeBookmark();
    memuatDaftarSurat();
});

function memuatDaftarSurat() {
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
                dataSurat = hasil.data;
                tampilkanSurat(dataSurat);
                perbaruiHitunganSurat(dataSurat.length);
            } else {
                throw new Error("Format data tidak sesuai");
            }
        })
        .catch(error => {
            console.error("Terjadi kesalahan:", error);
            tampilkanError("Gagal memuat daftar surat. Silakan periksa koneksi internet Anda.");
        })
        .finally(() => {
            hentikanLoading();
        });
}

/**
 * Menampilkan daftar surat ke dalam elemen #alquran
 * @param {Array} data - Array data surat dari API
 */
function tampilkanSurat(data) {
    const kontainer = document.getElementById("alquran");
    if (!kontainer) return;

    // Bersihkan konten sebelumnya sebelum merender ulang
    kontainer.innerHTML = "";

    if (!data || data.length === 0) {
        kontainer.innerHTML = `
            <div class="empty-state-box">
                <div class="empty-state-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                </div>
                <h2 class="empty-state-title">Surat Tidak Ditemukan</h2>
                <p class="empty-state-text">Tidak ada surat yang sesuai dengan kata kunci pencarian Anda.</p>
            </div>
        `;
        perbaruiHitunganSurat(0);
        return;
    }

    const daftarBookmark = ambilDaftarBookmark();
    let markup = "";

    for (let i = 0; i < data.length; i++) {
        const surat = data[i];
        const sudahBookmark = daftarBookmark.includes(surat.nomor);
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
                        class="btn btn-bookmark ${sudahBookmark ? 'active' : ''}" 
                        onclick="bookmarkSurat(${surat.nomor})"
                        aria-label="${sudahBookmark ? 'Hapus bookmark' : 'Bookmark'} ${surat.namaLatin}"
                        title="${sudahBookmark ? 'Tersimpan di bookmark' : 'Tambah ke bookmark'}"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="${sudahBookmark ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" aria-hidden="true">
                            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                        </svg>
                        <span>${sudahBookmark ? 'Tersimpan' : 'Bookmark'}</span>
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
    perbaruiHitunganSurat(data.length);
}

// Event listener pencarian surat
const inputCari = document.getElementById("cariSurat");
if (inputCari) {
    inputCari.addEventListener("input", function() {
        const keyword = this.value.trim().toLowerCase();

        if (keyword === "") {
            tampilkanSurat(dataSurat);
            const statusInfo = document.getElementById("statusInfo");
            if (statusInfo) statusInfo.textContent = "Daftar Semua Surat";
            return;
        }

        const hasilPencarian = dataSurat.filter(surat => {
            const namaLatinCocok = surat.namaLatin.toLowerCase().includes(keyword);
            const artiCocok = surat.arti.toLowerCase().includes(keyword);
            const nomorCocok = String(surat.nomor) === keyword;
            return namaLatinCocok || artiCocok || nomorCocok;
        });

        const statusInfo = document.getElementById("statusInfo");
        if (statusInfo) {
            statusInfo.textContent = `Hasil pencarian "${keyword}"`;
        }

        tampilkanSurat(hasilPencarian);
    });
}

function perbaruiHitunganSurat(jumlah) {
    const badge = document.getElementById("suratCount");
    if (badge) {
        badge.textContent = `${jumlah} Surat`;
    }
}

/**
 * Status loading
 */
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
    const kontainer = document.getElementById("alquran");
    if (!kontainer) return;

    kontainer.innerHTML = `
        <div class="empty-state-box">
            <h2 class="empty-state-title" style="color: var(--color-danger);">Terjadi Kesalahan</h2>
            <p class="empty-state-text">${pesan}</p>
            <button type="button" class="btn btn-primary" onclick="memuatDaftarSurat()">
                Coba Lagi
            </button>
        </div>
    `;
}

/**
 * Pengelolaan Bookmark
 */
function ambilDaftarBookmark() {
    try {
        const tersimpan = localStorage.getItem("bookmark");
        return tersimpan ? JSON.parse(tersimpan) : [];
    } catch (e) {
        console.error("Gagal membaca bookmark dari localStorage:", e);
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

function bookmarkSurat(nomor) {
    const bookmark = ambilDaftarBookmark();
    const index = bookmark.indexOf(nomor);

    if (index !== -1) {
        // Toggle: Jika sudah ada, hapus dari bookmark
        bookmark.splice(index, 1);
        localStorage.setItem("bookmark", JSON.stringify(bookmark));
        tampilkanToast("Surat dihapus dari bookmark");
    } else {
        // Tambahkan ke bookmark (mencegah duplikat)
        bookmark.push(nomor);
        localStorage.setItem("bookmark", JSON.stringify(bookmark));
        tampilkanToast("Surat berhasil ditambahkan ke bookmark");
    }

    perbaruiBadgeBookmark();

    // Re-render tampilan saat ini agar status tombol sinkron
    const inputCari = document.getElementById("cariSurat");
    const keyword = inputCari ? inputCari.value.trim().toLowerCase() : "";
    if (keyword) {
        const hasil = dataSurat.filter(s => s.namaLatin.toLowerCase().includes(keyword));
        tampilkanSurat(hasil);
    } else {
        tampilkanSurat(dataSurat);
    }
}

/**
 * Menampilkan notifikasi toast yang elegan
 */
let toastTimeout;
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

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.remove("show");
    }, 2800);
}
