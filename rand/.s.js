// non-data constants

const M = Qid('M')
const K = Qid('K')
const R = Qid('R')  // an iframe

// recite iframe interface

const block_page = () => {  // to indicate loading
  const a = A()
  a.innerHTML = 'يحمّل&hellip;'
  a.blur()
  //
  M.style.opacity = '0.35'
  K.style.display = 'block'
}

const unblock_page = () => {
  const a = A()
  a.innerHTML = 'ابدأ تسميعًا عشوائيًّا'
  a.focus()
  //
  M.style.opacity = '1'
  K.style.display = 'none'
}

const recite = (words, range) => {
  const url = '../../?rr&notitle&nopr&q=u&cn&'
            + (isdark() ? 'dark&' : 'light&') + 'words='+words + '&' + range
  if (R.style.display !== 'block') {  // if NOT starting a new one from inside Recite
    block_page()
    // showing transparently before loading, b/c tajweedlegend needs to know the page's height to show properly,
    // otherwise it'd be too large at first.
    R.style.opacity = '0'
    R.style.display = 'block'
    window.rr_show = () => {
      unblock_page()
      R.style.opacity = '1'
      setTimeout(() => R.focus(), 50)
      // ^ without a timeout, an Enter on the Start url would show the first word inconsistently
    }
    window.rr_return = () => { R.style.display = 'none' }
    window.rr_new    = () => { A().click() }
    window.rr_set_title = (t) => {
      document.title = (t ? t+' | ' : '') + 'رتّل راسخًا | تسميع عشوائي'
    }
  }
  R.src = url
}

// main script

let prefixes
let max_ayat  // non-unique 3+ ayat, thus quizzing at the max length of 6 ayat
block_page()
load_prefixes(ayat, (ans, max) => {
  prefixes = ans
  max_ayat = max
  unblock_page()
  update()
})

function button_attrs (rng) {
  const a = rng.split('-')[0] - 1  // rng is 1-based, but prefixes is 0-based
  const n = prefixes[a]
  if (max_ayat.has(a)) { rng = (a+1) + '-' + (a+6) }
  // const [a, z] = rng.split('-').map(e => +e)
  // if (min_ayat.has(a) && z - a + 1 < min_ayat.get(a)) {
  //   rng = a + '-' + (a + min_ayat.get(a) - 1)
  // }
  return `onclick="update(); recite(${n},'${rng}'); return false" href="#" role="button"`
}


