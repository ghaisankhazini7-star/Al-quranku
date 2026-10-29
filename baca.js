/**
 * Alquranku — baca.js
 * Memuat detail surat dan ayat-ayat Al-Qur'an
 */

const params = new URLSearchParams(window.location.search);
const nomorSurat = params.get("nomor");

tampilkanLoading();

if (!nomorSurat || isNaN(nomorSurat) || Number(nomorSurat) < 1 || Number(nomorSurat) > 114) {
    hentikanLoading();
    tampilkanError("Nomor surat tidak valid atau tidak ditemukan.");
} else {
    memuatSurat(nomorSurat);
}

function memuatSurat(nomor) {
    const url = `https://equran.id/api/v2/surat/${nomor}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Gagal memuat surat (${response.status})`);
            }
            return response.json();
        })
        .then(hasil => {
            if (!hasil || !hasil.data) {
                throw new Error("Data surat tidak ditemukan.");
            }
            const surat = hasil.data;
            tampilkanDetailSurat(surat);
        })
        .catch(error => {
            console.error("Kesalahan memuat surat:", error);
            tampilkanError("Gagal memuat ayat Al-Qur'an. Silakan periksa koneksi internet Anda.");
        })
        .finally(() => {
            hentikanLoading();
        });
}

function tampilkanDetailSurat(surat) {
    // Perbarui judul halaman
    document.title = `Surat ${surat.namaLatin} (${surat.nama}) — Alquranku`;

    // Isi informasi header surat
    const elNama = document.getElementById("namaSurat");
    const elArab = document.getElementById("suratNamaArab");
    const elArti = document.getElementById("suratArti");
    const elMeta = document.getElementById("suratMetaGroup");
    const elAudio = document.getElementById("audioMurotal");
    const elBasmalah = document.getElementById("basmalahContainer");

    if (elNama) elNama.textContent = surat.namaLatin;
    if (elArab) elArab.textContent = surat.nama;
    if (elArti) elArti.textContent = `"${surat.arti}"`;

    if (elMeta) {
        elMeta.innerHTML = `
            <span class="header-meta-pill">Surat ke-${surat.nomor}</span>
            <span class="header-meta-pill">Turun di ${surat.tempatTurun}</span>
            <span class="header-meta-pill">${surat.jumlahAyat} Ayat</span>
        `;
    }

    // Pemutar Audio Murottal
    if (elAudio && surat.audioFull) {
        // Ambil qari yang tersedia (prioritaskan '05' atau yang pertama tersedia)
        const audioSrc = surat.audioFull['05'] || 
                         surat.audioFull['01'] || 
                         Object.values(surat.audioFull)[0] || '';
        if (audioSrc) {
            elAudio.src = audioSrc;
        } else {
            elAudio.parentElement.style.display = "none";
        }
    }

    // Tampilkan Basmalah untuk semua surat kecuali Surat At-Taubah (9) dan Al-Fatihah (1 - ayat pertama adalah Basmalah)
    if (elBasmalah) {
        if (String(surat.nomor) !== "9" && String(surat.nomor) !== "1") {
            elBasmalah.style.display = "block";
        } else {
            elBasmalah.style.display = "none";
        }
    }

    // Render daftar ayat
    const elDaftarAyat = document.getElementById("daftarAyat");
    if (!elDaftarAyat) return;

    elDaftarAyat.innerHTML = "";
    let markup = "";

    for (let i = 0; i < surat.ayat.length; i++) {
        const ayat = surat.ayat[i];

        markup += `
            <article class="ayah-card" id="ayat-${ayat.nomorAyat}">
                <div class="ayah-card-top">
                    <span class="ayah-number-badge">
                        Ayat ${ayat.nomorAyat}
                    </span>
                    <button 
                        type="button" 
                        class="btn btn-bookmark" 
                        onclick="salinAyat('${surat.namaLatin}', ${ayat.nomorAyat})"
                        title="Salin teks ayat ini"
                        aria-label="Salin ayat ${ayat.nomorAyat}"
                    >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                        <span>Salin</span>
                    </button>
                </div>

                <div class="ayah-arabic" dir="rtl" lang="ar">
                    ${ayat.teksArab}
                </div>

                <p class="ayah-latin">${ayat.teksLatin}</p>
                <p class="ayah-terjemahan">${ayat.teksIndonesia}</p>
            </article>
        `;
    }

    elDaftarAyat.innerHTML = markup;
}

/**
 * Salin teks ayat ke clipboard
 */
function salinAyat(namaSurat, nomorAyat) {
    const card = document.getElementById(`ayat-${nomorAyat}`);
    if (!card) return;

    const teksArab = card.querySelector(".ayah-arabic")?.textContent.trim() || "";
    const teksTerjemahan = card.querySelector(".ayah-terjemahan")?.textContent.trim() || "";

    const formatSalin = `${teksArab}\n\n"${teksTerjemahan}"\n(QS. ${namaSurat}: ${nomorAyat})`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(formatSalin)
            .then(() => tampilkanToast(`Ayat ${nomorAyat} berhasil disalin ke clipboard`))
            .catch(() => alert(`Ayat ${nomorAyat} berhasil disalin.`));
    } else {
        alert(formatSalin);
    }
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
    const elDaftarAyat = document.getElementById("daftarAyat");
    if (!elDaftarAyat) return;

    elDaftarAyat.innerHTML = `
        <div class="empty-state-box">
            <h2 class="empty-state-title" style="color: var(--color-danger);">Terjadi Kesalahan</h2>
            <p class="empty-state-text">${pesan}</p>
            <a href="index.html" class="btn btn-primary">
                Kembali ke Beranda
            </a>
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
