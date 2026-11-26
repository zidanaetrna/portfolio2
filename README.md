# Deploy otomatis: GitHub Actions ke Netlify

Starter hands-on untirta-io. Setelah semua langkah di bawah beres, tiap kalian `git push` ke branch `main`, GitHub Actions bakal build web ini dan upload hasilnya ke Netlify.

Ikutin dari atas ke bawah, jangan loncat.

## 0. Yang harus ada dulu

- Akun GitHub
- Akun Netlify (daftar pakai "Sign up with GitHub" biar cepet)
- Git. Cek di terminal: `git --version`
- Node.js **22 atau lebih baru**. Cek: `node -v`. Node ini cuma buat nyoba di laptop. Kalau nggak ada, kalian tetap bisa ikut, soalnya build-nya jalan di GitHub.

Kalau belum pernah pakai Git di laptop ini, kenalin diri dulu (cukup sekali):

```
git config --global user.name "username-github-kalian"
git config --global user.email "email-github-kalian"
```

## 1. Bikin repo kalian sendiri dari template

Jangan clone `zidanaetrna/devops` langsung. Repo itu punya pembicara, kalian nggak bisa push ke sana dan nggak bisa isi secret-nya.

1. Buka https://github.com/zidanaetrna/devops
2. Klik **Use this template** → **Create a new repository**.
3. Owner: akun kalian. Nama repo: bebas (misal `deploy-pertama`). Pilih **Public**. Klik **Create repository**.
4. Clone repo **kalian** (bukan punya pembicara):

```
git clone https://github.com/<username-kalian>/<nama-repo>.git
cd <nama-repo>
```

> Tab **Actions** di repo kalian kemungkinan langsung nunjukin satu run yang **gagal**. Itu normal, secret Netlify-nya belum diisi. Nanti kita jalanin ulang di langkah 4.

Mau nyoba jalanin di laptop dulu (opsional, butuh Node):

```
npm install
npm run dev
```

Buka http://localhost:5173. Matiin pakai `Ctrl+C`.

## 2. Siapin Netlify

Netlify sekarang nyebut "site" sebagai "project". Isinya sama.

1. **Bikin project kosong.** Di halaman Projects klik **Add new project**. Scroll ke bagian **Upload your project files**, terus drag file `index.html` dari repo ini ke kotak itu. Isinya nggak penting, nanti ketimpa pas deploy pertama dari GitHub Actions.
   Jangan pilih **Import a Git repository**. Kalau itu yang dipilih, Netlify ikut build sendiri dan deploy-nya jadi dobel.
2. **Salin Site ID.** Buka project tadi → **Project configuration** → **General** → bagian **Project information** → salin **Project ID** (di bawahnya ada tulisan *Also known as Site ID*, itu angka yang sama).
3. **Bikin token.** Klik foto profil di pojok kiri bawah → **User settings** → **Applications** → **Personal access tokens** → **New access token**. Kasih nama (misal `github-actions`), pilih masa berlaku, terus salin tokennya. Token cuma ditampilin sekali.

Simpan dua nilai ini sementara di Notepad. Jangan di-commit ke repo.

## 3. Isi secret di repo kalian

Repo kalian di GitHub → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**. Bikin dua, namanya harus persis:

| Name | Secret |
|---|---|
| `NETLIFY_AUTH_TOKEN` | token dari langkah 2.3 |
| `NETLIFY_SITE_ID` | Site ID dari langkah 2.2 |

## 4. Jalanin workflow pertama kali

1. Buka tab **Actions** di repo kalian.
2. Klik run yang tadi gagal → tombol **Re-run jobs** di kanan atas → **Re-run all jobs**. Kalau nggak ada run sama sekali: klik **Deploy ke Netlify** di kiri → **Run workflow** → **Run workflow**.
3. Tunggu sampai semua step hijau (biasanya 1–2 menit). Klik tiap step buat liat apa yang dikerjain.
4. Buka URL Netlify kalian: `https://<nama-project>.netlify.app`. Ada juga di dashboard Netlify.

## 5. Ganti nama di branch

Kerjanya nggak langsung di `main`, tapi di branch, kayak di tim beneran.

1. Bikin branch baru:

   ```
   git checkout -b ganti-nama
   ```

2. Buka `index.html`, cari `<h1 class="hero__name"`, terus ganti `Nama <em>Kalian</em>` pakai nama kalian. Cukup di situ, nama di pojok kiri atas, footer, sama judul tab ikut ganti otomatis.

   ```html
   <h1 class="hero__name" data-split>Budi <em>Santoso</em></h1>
   ```

3. Commit terus push branch-nya, satu per satu:

   ```
   git commit -am "ganti nama"
   git push -u origin ganti-nama
   ```

   Pertama kali push, Git bakal buka browser buat login GitHub. Login aja, itu normal.

Web kalian **belum** berubah. Perubahannya masih di branch `ganti-nama`, belum masuk `main`.

## 6. Dari Pull Request sampai main

1. Buka repo kalian di GitHub, klik tombol **Compare & pull request** → **Create pull request**.
2. Buka tab **Actions**. Workflow jalan, tapi **cuma build**: step **Deploy ke Netlify** ke-skip. Ini CI, kodenya dicek dulu sebelum boleh masuk `main`.
3. Balik ke Pull request-nya. Kalau build-nya hijau, klik **Merge pull request** → **Confirm merge**.
4. Tab **Actions** lagi: workflow jalan di `main`, kali ini **sampai deploy**. Ini CD.
5. Refresh web kalian. Nama kalian sama tulisan **Versi build** di bawah halaman harus udah berubah.
6. Di laptop, balik ke `main` dan ambil versi terbaru:

   ```
   git checkout main
   git pull
   ```

## Jadiin portofolio kalian

Web ini udah berbentuk portofolio. Semua isinya ada di `index.html`, tinggal ganti teksnya. Tiap bagian udah dikasih komentar.

| Mau ganti | Di mana |
|---|---|
| Nama | `index.html`: `<h1 class="hero__name">`. Cukup di sini. Nama di pojok kiri atas, footer, sama judul tab otomatis ikut. Kata di dalam `<em>` jadi miring dan berwarna |
| Judul tab (kalau mau beda dari nama) | `index.html`: `<title>` |
| Kota di jam header | `index.html`: `top__clock` |
| Bio sama info singkat | `index.html`: bagian `PEMBUKA` |
| Proyek | `index.html`: bagian `KARYA`, satu proyek = satu `<li>`. Copy buat nambah |
| Foto latar pembuka | `index.html`: `src` di dalam `hero__media`. Pilih foto yang bawahnya gelap |
| Foto latar tiap proyek | Taruh file di `public/images/`, terus ganti `data-image="/images/nama-file.webp"`. Kosongin kalau nggak mau |
| Paragraf dan daftar Tentang | `index.html`: bagian `TENTANG` |
| Email dan link sosmed | `index.html`: bagian `KONTAK` |
| Warna aksen | `src/style.css`: `--accent` di paling atas |
| Warna kertas sama tinta | `src/style.css`: `--paper` sama `--ink` |

Yang bikin web ini kerasa halus:
- Scroll pakai inertia ([Lenis](https://github.com/darkroomengineering/lenis))
- Judul muncul per kata, naik dari balik garis
- Foto pembuka geser lebih lambat dari scroll, teksnya pelan-pelan memudar
- Hover satu proyek, latar section Karya berganti jadi foto proyek itu
- Email sama tombol "Ke atas" ketarik dikit ke arah kursor

Semua animasi itu otomatis mati buat orang yang nyalain "kurangi animasi" di HP/laptopnya. Foto latar proyek nggak muncul di HP, soalnya nggak ada hover.

Tips gambar: simpan dalam format WebP ukuran 1920×1080, usahain di bawah 400 KB per file biar web tetap enteng.

### Foto bawaan

Semua dari [Unsplash](https://unsplash.com/license), gratis dipakai tanpa izin. Ganti sama foto kalian sendiri kapan aja.

| File | Sumber |
|---|---|
| `langit-gunung.webp` | [Bima Sakti di atas pegunungan](https://unsplash.com/photos/milky-way-over-dark-mountain-silhouette-mRdcesxcIHY) |
| `bumi-satelit.webp` | [Bumi dan satelit](https://unsplash.com/photos/view-of-earth-and-satellite-yZygONrUBe8) |
| `gunung-es.webp` | [Gunung es di bawah langit berbintang](https://unsplash.com/photos/icy-mountains-under-starry-night-nI7knd5sQfo) |
| `bumi-afrika.webp` | [Bumi dengan awan di atas Afrika](https://unsplash.com/photos/earth-with-clouds-above-the-african-continent-vhSz50AaFAs) |
| `bulan-gunung.webp` | [Bulan terbenam di atas pegunungan](https://unsplash.com/photos/the-moon-is-setting-in-the-sky-over-the-mountains-TLxLwdHL2PU) |

## Pakai project kalian sendiri

Bisa, asal project-nya di-build pakai `npm run build` dan hasilnya web statis (HTML/CSS/JS).

1. Copy `.github/workflows/deploy.yml` dari repo ini ke project kalian, path-nya harus sama persis.
2. Ganti `PUBLISH_DIR` di `deploy.yml` sesuai folder hasil build:

   | Project | `PUBLISH_DIR` |
   |---|---|
   | Vite (React/Vue/Svelte/vanilla), Astro | `dist` |
   | Create React App | `build` |
   | Next.js dengan `output: 'export'` | `out` |

3. Branch utamanya harus `main`. Kalau masih `master`, jalanin `git branch -M main` terus push, atau ganti `branches: [main]` di `deploy.yml`.
4. Lanjut dari langkah 2 di atas.

## Kalau gagal

Buka run yang merah di tab Actions, klik step yang ada tanda silangnya, baca pesan error-nya.

| Pesan | Penyebab | Benerin |
|---|---|---|
| `Secret NETLIFY_AUTH_TOKEN atau NETLIFY_SITE_ID belum diisi` | Secret belum dibikin atau namanya salah | Cek langkah 3, nama harus huruf besar semua dan persis sama |
| `Unauthorized` / `401` | Token salah, kedaluwarsa, atau udah dihapus | Bikin token baru, timpa secret `NETLIFY_AUTH_TOKEN` |
| `Not Found` / `404` | Site ID salah | Salin ulang dari Netlify, timpa `NETLIFY_SITE_ID` |
| `Folder 'dist' nggak ada setelah build` | Folder hasil build project kalian beda | Ganti `PUBLISH_DIR` |
| `Missing script: "build"` | `package.json` nggak punya script `build` | Tambahin script-nya |
| `npm ci` error soal lockfile | `package-lock.json` nggak sinkron atau nggak ke-commit | Jalanin `npm install` di laptop, commit `package-lock.json` |
| `git push` ditolak `403` | Kalian push ke repo orang lain, atau belum login | Cek `git remote -v`, harus repo kalian. Kalau salah: `git remote set-url origin https://github.com/<username-kalian>/<nama-repo>.git` |
| Workflow nggak muncul sama sekali | File nggak di `.github/workflows/`, atau branch bukan `main` | Cek path file dan nama branch |
| Hijau tapi web nggak berubah | Ke-cache browser | `Ctrl+Shift+R` atau buka di incognito |
