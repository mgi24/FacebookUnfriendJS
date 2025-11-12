function isNonLatin(str) {
    // Regex: hanya karakter Latin (A-Z, a-z, spasi, tanda baca umum)
    return /[^\u0000-\u024F\s.,'-]/.test(str);
}

// Set untuk menyimpan nama yang sudah discan
const scannedNames = new Set();
scannedNames.clear();
function unfriendByName(name, optionBtn) {
    return new Promise(resolve => {
        if (optionBtn) {
            optionBtn.click();
            console.log('Clicked options button for:', name);

            setTimeout(() => {
                const unfriendBtn = Array.from(document.querySelectorAll('span[dir="auto"]'))
                    .find(span => span.textContent.trim() === 'Hapus pertemanan');
                if (unfriendBtn) {
                    unfriendBtn.click();
                    console.log('Clicked "Hapus pertemanan" for:', name);

                    setTimeout(() => {
                        const confirmBtn = Array.from(document.querySelectorAll('span.x1lliihq'))
                            .find(span => span.textContent.trim() === 'Konfirmasi');
                        if (confirmBtn) {
                            confirmBtn.click();
                            console.log('Clicked "Konfirmasi" for:', name);
                        } else {
                            console.warn('"Konfirmasi" button not found for:', name);
                        }
                        resolve();
                    }, 1000);
                } else {
                    console.warn('"Hapus pertemanan" button not found for:', name);
                    resolve();
                }
            }, 500);
        } else {
            console.warn('Options button not found for:', name);
            resolve();
        }
    });
}



// Fungsi utama untuk scan nama teman
async function scanFriends() {
    window.stop = false; // Flag untuk menghentikan loop

    let lastHeight = 0;

    while (!window.stop) {
        // Ambil semua panel utama teman
        const friendPanels = Array.from(document.querySelectorAll('div.x6s0dn4.x1obq294.x5a5i1n.xde0f50.x15x8krk.x1olyfxc.x9f619'));

        for (const panel of friendPanels) {
            // Cari nama teman di panel ini
            const nameSpan = panel.querySelector('span[dir="auto"].x193iq5w');
            const name = nameSpan ? nameSpan.innerText.trim() : null;

            // Abaikan jika nama tidak ada atau mengandung "teman bersama"
            if (!name || /\d+\s+teman bersama/i.test(name) || scannedNames.has(name)) continue;

            scannedNames.add(name);
            console.log('New name detected:', name);

            // Cari foto profil di panel ini (img di dalam panel)
            const profileImg = panel.querySelector('img');
            const imgSrc = profileImg ? profileImg.src : null;
            // Cari tombol "Opsi lainnya" di panel ini (dengan class x9f619 dan aria-label)
            const optionBtn = panel.querySelector('div.x9f619 [aria-label^="Opsi lainnya untuk"]');
  
            if (imgSrc) {
                // console.log('Profile image src for', name, ':', imgSrc);
                const defaultProfileSrc = 'https://scontent-sin2-1.xx.fbcdn.net/v/t1.30497-1/453178253_471506465671661_2781666950760530985_n.png?stp=cp0_dst-png_s80x80&_nc_cat=1&ccb=1-7&_nc_sid=5cdb2e&_nc_ohc=AGC__Ym0omkQ7kNvwEH6O0v&_nc_oc=Adk1pn_6dQngReOak3snCLmfsFUcbnE7omGsdGgOcvTAsoinibTt2fsLG9T_KP93o4k&_nc_zt=24&_nc_ht=scontent-sin2-1.xx&oh=00_Afj_aA5iQT_vhhQsm06AFxRTYd3aIi_0R-WGtgzj2AY8og&oe=693A4E7A'; //edit ini sekali saat lihat foto profil default facebook
                if (imgSrc === defaultProfileSrc) {
                    console.log('Default profile picture detected for:', name);
                    await unfriendByName(name, optionBtn);
                    // Force scroll setelah unfriend
                    window.scrollBy(0, 100);
                    await new Promise(res => setTimeout(res, 500));
                }
            }

            if (isNonLatin(name)) {
                console.log('Non-latin name detected:', name);
                await unfriendByName(name, optionBtn);
                window.scrollBy(0, 100);
                await new Promise(res => setTimeout(res, 500));
            }
        }

        // Scroll berkali-kali dengan interval pendek
        for (let i = 0; i < 3; i++) {
            window.scrollTo(0, document.body.scrollHeight);
            await new Promise(res => setTimeout(res, 300));
        }

        // Jika Anda ingin menunggu menggunakan Promise, gunakan resolve (res) di dalam Promise.
        // Contoh:
        await new Promise(resolv => setTimeout(resolv, 2000));

        // Tunggu sampai halaman selesai load (tinggi halaman berubah)
        while (document.body.scrollHeight === lastHeight) {
            await new Promise(resolv => setTimeout(resolv, 1000));
        }
        lastHeight = document.body.scrollHeight;
    }

    console.log('Selesai scan. Untuk menghentikan, set window.stop = true');
    scannedNames.clear();

}

scanFriends();
