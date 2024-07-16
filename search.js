'use strict'

function close_search () {
  // hide tafsir
  hide_el(el_sxc)
  setTimeout(() => { el_sxc.style.display = 'none' }, 1000)
  // delay is matching animation duration in style.css > .popup
}

Q('#sxc > .x').onclick = close_search


// fold final-word heh <=> teh <=> teh marbuta
// fold alef => alef maqsura, alef hamza, alef hamza below, alef madd
// fold alef maqsura => alef, yeh, yeh hamza, alef hamza, alef hamza below
// fold yeh => alef maqsura, yeh hamza, alef hamza, alef hamza below
// fold waw => waw hamza
// fold any hamza letter => any other hamza letter, the plain letter of the original:
//    alef for أ إ آ
//    yeh and alef maqsura for ئ
//    waw for ؤ
const hmz = 'آأإئؤء]'  // = "any hamza letter" + char-class closing
function arabic_fold (txt) {  // takes string, return a regex
  return txt
    .replace(/[هتة]\b/g, 'T')
    .replace(/ا/g, 'A')
    .replace(/ى/g, 'Y')
    .replace(/ي/g, 'I')
    .replace(/و/g, 'W')
    .replace(/[آأإ]/g, 'a')
    .replace(/ئ/g, 'i')
    .replace(/ؤ/g, 'w')
    .replace(/ء/g, 'x')
    //
    .replace(/T/g, '[هتة]')
    .replace(/A/g, '[اىأإآ]')
    .replace(/Y/g, '[ايىئأإ]')
    .replace(/I/g, '[يىئ]')
    .replace(/W/g, '[وؤ]')
    .replace(/a/g, '[ا'+hmz)
    .replace(/i/g, '[يى'+hmz)
    .replace(/w/g, '[و'+hmz)
    .replace(/x/g, '['+hmz)
}

const sx_init_msg = '<center>أدخل جزءًا من آية للبحث عنها</center>'

function show_search (el_sura, el_aaya) {

  // show search popup
  el_sxq.value = ''
  el_sxr.innerHTML = sx_init_msg
  el_sxc.style.display = 'block'
  show_el(el_sxc)
  el_sxq.focus()

  // find() is called only when these conditions are met:
  // 1. plain imlaai text is loaded
  // 2. the search query has at least one non-space letter
  // 3. the search text field has not changed for some time (one second)
  //
  // find() is called by find_wrapper() (handling condition 1),
  // which is called by el_sxq.oninput (which handles conditions 2 and 3).
  //
  // when the sura selector changes, find_wrapper() is called immediately,
  // if the second condition is met.

  let waiting = false  // if the spinner is shown; see wait()
  const find = () => {
    waiting = false
    const ss = el_sura_sx.value  // '' (all) or a 0-based sura
    const st = ss === '' ? 0    : sura_offset[ss]
    const en = ss === '' ? 6236 : st + sura_length[ss]
    const q = arabic_fold(el_sxq.value)
    const r = ayat.p
      .map((a, i) => st <= i && i < en && a.match(q) ? i : -1)
      .filter(i => i !== -1)
    if (r.length > 50) {
      el_sxr.innerHTML = '<center>يطابق بحثك '+toarab(r.length)+' من الآيات، وهو أكثر من ٥٠؛ حاول التحديد أكثر</center>'
    }
    else if (r.length === 0) {
      el_sxr.innerHTML = '<center>تعذر إيجاد العبارة التي أدخلتها</center>'
    }
    else {
      el_sxr.innerHTML = `<center>يوجد ${toarab(r.length)} من الآيات</center>` 
      const aa = range(r.length).map(a => make_elem('div', { className: 'ac' }))
      aa.forEach((a,j) => {
        const i = r[j]  // 0-based
        const su = sura_of(i+1) - 1         // now this is 0-based
        const ay = i - sura_offset[su] + 1  // now this is 1-based ^_^'
        const anum = toarab(ay)
        const name = sura_name[su]
        a.onclick = () => {
          el_sura.value = su;  validate_aaya_sura_input({ target: el_sura })  // updates the aayaat field
          el_aaya.value = ay;  validate_aaya_sura_input({ target: el_aaya })  // updates the other pair of fields
          close_search()
        }
        a.append(
          make_elem('span', { className: 's_a', innerHTML: `سورة ${name} آية ${anum}:` }),
          make_elem('span', { className: 'aya', innerHTML: '<span>يحمّل</span>' }),
        )
      })
      el_sxr.append(...aa, spinner)
      //
      load('u', () => {
        for (let i = 0; i < r.length; ++i) {
          aa[i].Q('.aya').innerText = ayat.u[r[i]].replace(/[#A-Z<>]+/g, '')
        }
        el_sxr.removeChild(spinner)  // remove the spinner when all aayaat are rendered
      })
    }
  }

  let int

  function init () {
    clearTimeout(int); int = null
    waiting = false
    el_sxr.innerHTML = sx_init_msg
  }

  function wait () {
    clearTimeout(int); int = null
    if (!waiting) { el_sxr.insertBefore(spinner, el_sxr.firstChild) }
    // ^ this condition is to avoid restarting the spinner on each input event.
    waiting = true
    int = setTimeout(find_wrapper, 1000)
  }

  const find_wrapper = () => ayat.p ? find() : wait()

  const filter_query = (val) => val
    .replace(/\s+/g, ' ')             // collapse spaces
    .replace(/\u06A9/g, 'ك')          // keheh to arabic kaf
    .replace(/\u06CC/g, 'ي')          // farsi yeh to arabic yeh
    .replace(/[\u06BE\u06C1]/g, 'ه')  // heh doachashamee or heh goal to arabic heh
    .replace(/[^ء-غف-ي ]/g, '')       // remove all non-imlaai letters or spaces

  let old = ''
  el_sxq.oninput = (ev) => {
    const pos = el_sxq.selectionStart
    const len = el_sxq.value.length
    const entered = el_sxq.value[pos-1]
    const next = el_sxq.value[pos]
    el_sxq.value = filter_query(el_sxq.value)
    el_sxq.selectionStart = el_sxq.selectionEnd = pos - (len - el_sxq.value.length)  // fix cursor position after filtering
      + (entered === ' ' && next === ' ' ? 1 : 0)
      // if the user pressing space, which is rejected b/c of a following space, then advance one step
    const val = el_sxq.value === ' ' ? '' : el_sxq.value
    // ^ consider a space-only query to be equivalent to an empty query, without changing the input field,
    // to allow the user to start the query with a space,
    // b/c a space is considered a word delimiter, even at the beginning and end of an aaya.
    if (old === val) { old = val; return } else { old = val }
    if (val === '') { init(); return }
    // if neither:
    wait()
  }

  el_sura_sx.oninput = () => {
    const q = filter_query(el_sxq.value)
    if (q !== '' && q !== ' ') {  // has a valid query
      clearTimeout(int); int = null
      find_wrapper()
    }
  }

  load_plain(() => {})
}

