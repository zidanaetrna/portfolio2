import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import '@fontsource/instrument-serif/400.css'
import '@fontsource/instrument-serif/400-italic.css'

// Waktu build ditanem pas `npm run build`, jadi tiap deploy baru angkanya berubah.
// Gampang buat ngecek: "web gua udah ke-update belum?"
document.getElementById('build-time').textContent = __BUILD_TIME__
document.getElementById('year').textContent = new Date().getFullYear()

// ---------- Nama cukup ditulis sekali di <h1> ----------
// Pojok kiri atas sama footer ([data-name]) otomatis ngikut.
// Judul tab juga ikut, tapi cuma kalau <title> masih bawaan ("Nama Kalian").
const heroNameEl = document.querySelector('.hero__name')
const fullName = heroNameEl?.textContent.replace(/\s+/g, ' ').trim()
if (fullName) {
  document.querySelectorAll('[data-name]').forEach((el) => (el.textContent = fullName))
  if (document.title.trim() === 'Nama Kalian') document.title = fullName
}

const reduceMotion =window.matchMedia('(prefers-reduced-motion: reduce)').matches
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches

// ---------- Jam lokal di header ----------
const clock = document.getElementById('clock')
const tickClock = () => {
  clock.textContent = new Date().toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Jakarta',
  })
}
tickClock()
setInterval(tickClock, 10_000)

// ---------- Scroll halus (inertia) pakai Lenis ----------
let lenis = null
if (!reduceMotion) {
  lenis = new Lenis({ autoRaf: true, anchors: true, lerp: 0.09 })
}

// ---------- Pecah teks jadi per kata ----------
// Tiap kata dibungkus dua <span>: luar buat "jendela", dalam yang naik.
// Tag di dalamnya (misal <em>) tetap dipertahanin.
function splitWords(root) {
  let i = 0
  const walk = (node) => {
    ;[...node.childNodes].forEach((child) => {
      if (child.nodeType === Node.ELEMENT_NODE) return walk(child)
      if (child.nodeType !== Node.TEXT_NODE) return
      const frag = document.createDocumentFragment()
      child.textContent.split(/(\s+)/).forEach((part) => {
        if (!part) return
        if (/^\s+$/.test(part)) return frag.append(' ')
        const outer = document.createElement('span')
        const inner = document.createElement('span')
        outer.className = 'word'
        inner.textContent = part
        inner.style.setProperty('--i', i++)
        outer.append(inner)
        frag.append(outer)
      })
      child.replaceWith(frag)
    })
  }
  walk(root)
  root.classList.add('is-split')
}
document.querySelectorAll('[data-split]').forEach(splitWords)

// ---------- Muncul pas di-scroll ----------
// Elemen yang satu parent munculnya gantian, jeda 0.08 detik.
const revealEls = document.querySelectorAll('[data-reveal], [data-split]')
const order = new Map()
revealEls.forEach((el) => {
  if (!el.hasAttribute('data-reveal')) return
  const parent = el.closest('ul, .columns, .hero__meta') ?? el.parentElement
  const i = order.get(parent) ?? 0
  el.style.setProperty('--delay', `${i * 0.08}s`)
  order.set(parent, i + 1)
})

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return
      entry.target.classList.add('is-visible')
      observer.unobserve(entry.target)
    })
  },
  { threshold: 0.2, rootMargin: '0px 0px -5% 0px' }
)
revealEls.forEach((el) => observer.observe(el))

// ---------- Pembuka: foto geser lebih lambat dari scroll (parallax) ----------
// Fotonya turun pelan, teksnya ikut geser dikit sambil memudar.
const heroImg = document.querySelector('.hero__media img')
const heroText = document.querySelectorAll('.hero__name, .hero__meta')
if (lenis && heroImg) {
  lenis.on('scroll', ({ scroll }) => {
    const h = window.innerHeight
    if (scroll > h * 1.2) return
    heroImg.style.transform = `translate3d(0, ${scroll * 0.3}px, 0)`
    heroText.forEach((el) => {
      el.style.transform = `translate3d(0, ${scroll * 0.12}px, 0)`
      el.style.opacity = String(Math.max(0, 1 - scroll / (h * 0.8)))
    })
  })
}

// ---------- Karya: latar section ganti jadi foto proyek yang di-hover ----------
const worksSection = document.querySelector('.works-section')
const worksMedia = document.querySelector('.works__media')
const works = document.querySelector('.works')
if (finePointer && worksSection && worksMedia && works) {
  works.querySelectorAll('.work').forEach((work) => {
    const src = work.dataset.image
    if (!src) return
    // Satu <img> per proyek, ditumpuk. Yang aktif tinggal dimunculin.
    const img = document.createElement('img')
    img.src = src
    img.alt = ''
    img.decoding = 'async'
    worksMedia.append(img)

    work.addEventListener('pointerenter', () => {
      worksMedia.querySelectorAll('img').forEach((el) => el.classList.toggle('is-active', el === img))
      worksSection.classList.add('is-lit')
    })
  })

  works.addEventListener('pointerleave', () => {
    worksSection.classList.remove('is-lit')
    worksMedia.querySelectorAll('img').forEach((el) => el.classList.remove('is-active'))
  })
}

// ---------- Elemen "magnetik": ketarik dikit ke arah kursor ----------
if (finePointer && !reduceMotion) {
  document.querySelectorAll('.magnetic').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      // Geserannya dibatesin maksimal 14px, biar elemen gede (kayak email) nggak kabur dari layar
      const r = el.getBoundingClientRect()
      const clamp = (v) => Math.max(-14, Math.min(14, v))
      const x = clamp((e.clientX - (r.left + r.width / 2)) * 0.2)
      const y = clamp((e.clientY - (r.top + r.height / 2)) * 0.3)
      el.style.transform = `translate(${x}px, ${y}px)`
    })
    el.addEventListener('pointerleave', () => {
      el.style.transform = ''
    })
  })
}
