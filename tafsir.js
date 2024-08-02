'use strict'

const qwSet = (s) => new Set(s.split(' '))

const big = [ 0, 7, 107, 217, 293, 493, 669, 789, 954, 1160, 1235, 1364, 1473, 1596, 1707, 1750, 1901, 2029, 2140, 2250, 2348, 2483, 2595, 2673, 2791, 2855, 2932, 3159, 3252, 3340, 3409, 3533, 3606, 3705, 3970, 4058, 4133, 4272, 4472, 4583, 4630, 4901, 5104, 5163, 5241, 5447, 5672, 5993, 6130, 6236 ]

const small = [ 0, 493, 954, 1473, 2140, 2932, 3788, 4735, 6236 ]

const Big =  // tafasir that are big and thus are split into 50 files; others are split into 8 parts only.
  qwSet('tanweer tabary qortoby waseet katheer baghawy sa3dy fa_khorramdel')

const RTL = qwSet('dv fa ku ps sd ug ur')

const tafsir = {}

////////////////////////////////////////////////////////////////////////////////

let last_tafsir
// because showing a tafsir remembers the scroll position, which is the wrong behavior,
// unless re-openning the same tafsir with the same aayah.

function tv (i) {
  const name = el_tafsir.value
  const lang = (() => { const m = name.match(/^([a-z]+)_/); return m ? m[1] : 'ar' })()
  const attr = lang === 'ar' ? ' ' : RTL.has(lang) ? ` lang="${lang}" ` : ` lang="${lang}" dir="ltr" `
  // const title = el_tafsir.Q('[value="'+el_tafsir.value+'"]').innerText
  const title = el_tafsir.innerHTML.match('value="'+el_tafsir.value+'"[^<>]*>([^<>]+)')[1]
  const t = attr === ' ' ? title : `ترجمة <span${attr}>${title}</span>`
  // show tafsir
  el_tvc.style.display = 'block'
  show_el(el_tvc)
  // reset scroll position unless same tafsir and same aayah
  const this_tafsir = i + ';' + name
  if (last_tafsir !== this_tafsir) { __scroll_top(el_tvc) }
  last_tafsir = this_tafsir
  // compose header
  const s = sura_of(i) - 1
  const aya = ayat.u[i-1].replace(/[#A-Z<>]+/g, '')
  const head = `<p>${t} للآية ${toarab(i - sura_offset[s])} من سورة ${sura_name[s]}</p><p id="tafsirnote">(يمكن تغيير التفسير من «الخيارات» في أعلى الصفحة بعد إغلاق التفسير)</p><p class="aya">${aya}</p><hr>`
  // loading screen
  el_tv.innerHTML = head
  el_tv.append(spinner)
  // get the tafsir
  get_tafsir(name, i, (content) => { el_tv.innerHTML = head + '<div'+attr+'id="tvtxt">'+content+'</div>' })
}

Q('#tvc > .x').onclick = () => {
  // hide tafsir
  hide_el(el_tvc)
  setTimeout(() => { el_tvc.style.display = 'none' }, 1000)
  // delay is matching animation duration in style.css > .popup
}

////////////////////////////////////////////////////////////////////////////////

function get_tafsir (name, i, callback) {
  load_tafsir(name, i, (txt) => callback(txt === ''
    ? '<center>(لا يوجد تفسير لهذه الآية؛ اختر تفسيرا آخر أو آية أخرى)</center>'
    : txt.replace(/اً/g, 'ًا')
  ))
}

function load_tafsir (name, i, callback) {
  const seps = Big.has(name) ? big : small
  const part = seps.findIndex(a => i <= a)  // assumption: 0 < i <= 6236; returns 1-based
  const p = part-1
  const cb = () => callback(tafsir[name][p][i-seps[p]-1])
  //
  if (tafsir[name] == null) { tafsir[name] = [] }
  if (tafsir[name][p]) { cb(); return }
  z(`rt/${name}-${part}.lzma`, (txt) => { tafsir[name][p] = txt; cb() })
}

