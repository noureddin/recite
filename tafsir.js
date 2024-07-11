'use strict'

const spinner = '<svg id="spinner-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle id="spinner" cx="50" cy="50" r="35" fill="none" stroke-width="10px" stroke-dasharray="40 30"/></svg>'

// all are the first ayah of a sura. the last three are the first ayah of a juz.
const sep_ayah = [ 0, 7, 293, 493, 669, 789, 954, 1160, 1235, 1364, 1473, 1596, 1707, 1750, 1802, 1901, 2029, 2140, 2250, 2348, 2483, 2595, 2673, 2791, 2855, 2932, 3159, 3252, 3340, 3409, 3469, 3503, 3533, 3606, 3660, 3705, 3788, 3970, 4058, 4133, 4218, 4272, 4325, 4414, 4473, 4510, 4545, 4583, 4612, 4630, 4675, 4735, 4784, 4846, 4901, 4979, 5075, 5104, 5241, 5672, 6236 ]

const tafsir = {}

const part_num = (i) => sep_ayah.findIndex(a => i <= a)  // assumption: 0 <= i <= 6236

////////////////////////////////////////////////////////////////////////////////

function tv (i) {
  const name = el_tafsir.value
  // const title = el_tafsir.Q('[value="'+el_tafsir.value+'"]').innerText
  const title = el_tafsir.innerHTML.match('value="'+el_tafsir.value+'"[^<>]*>([^<>]+)')[1]
  const t = name.match(/_/) && name.match(/^ar_/) == null ? 'ترجمة '+title : title
  const lang = (() => { const m = name.match(/^([a-z]+)_/); return m ? m[1] : 'ar' })()
  const attr = lang !== 'ar' ? ` lang="${lang}" dir="ltr" ` : ' '
  // show tafsir
  el_tvc.style.display = 'block'
  show_el(el_tvc)
  // compose header
  const s = sura_of(i) - 1
  const aya = ayat.uthm[i-1].replace(/[#A-Z<>]+/g, '')
  const head = `<p>${t} للآية ${toarab(i - sura_offset[s])} من سورة ${suar_name[s]}</p><p id="tafsirnote">(يمكن تغيير التفسير من «الخيارات» في أعلى الصفحة بعد إغلاق التفسير)</p><p class="aya">${aya}</p><hr>`
  // loading screen
  el_tv.innerHTML = head + spinner
  // get the tafsir
  get_tafsir(name, i, (content) => { el_tv.innerHTML = head + '<div'+attr+'id="tvtxt">'+content+'</div>' })
}

el_tvx.onclick = () => {
  // hide tafsir
  hide_el(el_tvc)
  setTimeout(() => { el_tvc.style.display = 'none' }, 1000)
  // delay is matching animation duration in style.css > #tvc
}

////////////////////////////////////////////////////////////////////////////////

function get_tafsir (name, i, callback) {
  load_tafsir(name, i, (txt) => callback(txt === ''
    ? '<center>(لا يوجد تفسير لهذه الآية؛ اختر تفسيرا آخر أو آية أخرى)</center>'
    : txt.replace(/اً/g, 'ًا')
  ))
}

function load_tafsir (name, i, callback) {
  if (name.match(/_/)) {  // one file
    if (tafsir[name]) { callback(tafsir[name][i-1]); return }
    G('rt/'+name+'.gz').then((txt) => {
      tafsir[name] = txt.split('\n')
      callback(tafsir[name][i-1])
    })
  }
  else {  // partitioned
    const part = part_num(i)
    const p = part-1
    if (tafsir[name] == null) { tafsir[name] = [] }
    if (tafsir[name][p]) { callback(tafsir[name][p][i-sep_ayah[p]-1]); return }
    G('rt/'+name+'-'+part+'.gz').then((txt) => {
      tafsir[name][p] = txt.split('\n')
      callback(tafsir[name][p][i-sep_ayah[p]-1])
    })
  }
}

