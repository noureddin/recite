'use strict'

// all are the first ayah of a sura. the last three are the first ayah of a juz.
const sep_ayah = [ 0, 7, 293, 493, 669, 789, 954, 1160, 1235, 1364, 1473, 1596, 1707, 1750, 1802, 1901, 2029, 2140, 2250, 2348, 2483, 2595, 2673, 2791, 2855, 2932, 3159, 3252, 3340, 3409, 3469, 3503, 3533, 3606, 3660, 3705, 3788, 3970, 4058, 4133, 4218, 4272, 4325, 4414, 4473, 4510, 4545, 4583, 4612, 4630, 4675, 4735, 4784, 4846, 4901, 4979, 5075, 5104, 5241, 5672, 6236 ]

const RTL = new Set('dv fa ku ps sd ug ur'.split(' '))

const tafsir = {}

const part_num = (i) => sep_ayah.findIndex(a => i <= a)  // assumption: 0 <= i <= 6236

////////////////////////////////////////////////////////////////////////////////

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
  const part = part_num(i)
  const p = part-1
  const cb = () => callback(tafsir[name][p][i-sep_ayah[p]-1])
  //
  if (tafsir[name] == null) { tafsir[name] = [] }
  if (tafsir[name][p]) { cb(); return }
  G('rt/'+name+'-'+part+'.gz').then((txt) => {
    tafsir[name][p] = txt.split('\n')
    cb()
  })
}

