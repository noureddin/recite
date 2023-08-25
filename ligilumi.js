// ligilumi: reading url parameters

const MAX_JUZ  = 30
const MAX_HIZB = 60
const MAX_RUB  = 240
const MAX_AYA  = 6236
const MAX_SURA = 114
const MAX_PAGE = 604
const MAX_RUKU = 556

function is_number (x) {
  return x == null ? x : !!x.match(/^[0-9]+$/)
}

function __paired (pair, sep) {  // auxiliary function for is_valid_pair
  const elems = pair.split(sep)
  return elems.length === 2 && elems.every(is_number)
}

function is_valid_pair (x) {  // a number, empty string, or two numbers separated by slash or double-slash
  return x === '' || is_number(x) || __paired(x, '//') || __paired(x, '/')
}

function range_to_pair (x) {
  let xs = x.split('-')
  if (!xs.every(is_valid_pair)) { return [null, null] }
  return xs.length === 2 ? xs : xs.length === 1 ? [x, x] : [null, null]
}

function suras_to_ayat (stsura, ensura) {  // each is 1-114
  if (!is_number(stsura) || !is_number(ensura)) { return [null, null] }
  stsura = +stsura || 1
  ensura = +ensura || MAX_SURA
  if (stsura < 1        || ensura < 1       ) { return [null, null] }
  if (stsura > MAX_SURA || ensura > MAX_SURA) { return [null, null] }
  const st = start_(stsura - 1) + 1
  const en = start_(ensura - 1) + suar_length[ensura - 1]
  return [st, en]
}

function idx2aya (idx) {  // 0-6235
  if (idx < 0 || idx > 6236) { return [null, null] }
  const s = [...Array(114).keys()].find(s => idx >= start_(s) && idx < start_(s + 1))
  return [s + 1, idx - start_(s) + 1]
}


function _aya2idx (aya) {  // 1-6236 or 1/7
  if (aya.includes('/')) {
    let a = aya.split('/');
    if (a.length !== 2) { return }
    if (+a[0] < 1 || +a[0] > MAX_SURA) { return }
    if (+a[1] < 1 || +a[1] > suar_length[+a[0] - 1]) { return }
    return start_(+a[0] - 1) + +a[1]
  }
  else {
    if (+aya > MAX_AYA) { return }
    return +aya
  }
}

function ayat_to_ayat (staya, enaya) {  // each is 1-6236 or 1/7 (sura/aya)
  if (!staya) { return [null, null] }
  let st = _aya2idx(staya)
  let en = _aya2idx(enaya)
  if (st == null || en == null) { return [null, null] }
  st = +st || 1; en = +en || MAX_AYA
  return [st, en]
}

function __sura_ruku__to__st_en (s, k) {
  if (k > rukus[s-1].length) { return null }
  const st = start_(s-1) + rukus[s-1][k-1]
  const en = k === rukus[s-1].length
    ? -1 + start_(s)   + rukus[s][0]    // next sura
    : -1 + start_(s-1) + rukus[s-1][k]  // same sura
  return [st, en]
}

function _ruku2idx (ruku) {  // each is 1/1 (sura/ruku) -- TODO: remove redundant computations
  if (ruku.includes('/')) {
    let k = ruku.split('/')
    if (k.length !== 2 || +k[0] > MAX_SURA) { return null }
    return __sura_ruku__to__st_en(+k[0], +k[1])
  }
  else {
    if (+ruku > MAX_RUKU) { return }
    for (let s = 0; s < MAX_SURA; ++s) {
      const max_sura_ruku = rukus[s].length
      for (let r = 0; r < max_sura_ruku; ++r) {
        ruku -= 1
        if (ruku === 0) { return __sura_ruku__to__st_en(s+1, r+1) }
      }
    }
  }
}

function rukus_to_ayat (struku, enruku) {  // each is 1/1 (sura/ruku)
  if (struku == null) { return [null, null] }
  let stpair = _ruku2idx(struku)
  let enpair = _ruku2idx(enruku)
  if (stpair == null || enpair == null) { return [null, null] }
  return [stpair[0], enpair[1]]
}

function pages_to_ayat (stpage, enpage) {  // each is 1-604
  if (stpage == null) { return [null, null] }
  stpage = +stpage || 1; enpage = +enpage || MAX_PAGE
  if (stpage > MAX_PAGE || enpage > MAX_PAGE) { return [null, null] }
  let st = pages[+stpage - 1] + 1
  let en = pages[+enpage]
  return [st, en]
}

function juzs_to_ayat (stjuz, enjuz) {  // each is 1-30
  if (stjuz == null) { return [null, null] }
  stjuz = +stjuz || 1
  enjuz = +enjuz || MAX_JUZ
  if (stjuz > MAX_JUZ || enjuz > MAX_JUZ) { return [null, null] }
  // we multiply by 8, as we have only data for rubs.
  const ratio = MAX_RUB / MAX_JUZ  // 8
  let st = rubs[((stjuz || 1)      - 1) * ratio] + 1
  let en = rubs[((enjuz || MAX_JUZ)   ) * ratio]
  return [st, en]
}

function __pair2idx (ratio, max, pair) {  // auxiliary function for _rub2idx() & _hizb2idx()
  if (pair.length !== 2) { return }
  if (+pair[0] < 1 || +pair[0] > max) { return }
  if (+pair[1] < 0 || +pair[1] > ratio) { return }
  return (+pair[0] - 1) * ratio + +pair[1] + 1
}

function _rub2idx (rub) {  // 1-240 or 1/1-60/4 or 1//1-30//8.
  // 30//8: [0] is juz, [1] is 1/8; i.e., it's the ([0]-1)*8+[1] 'th rub
  // 60/4: [0] is hizb, [1] is 1/4; i.e., it's the ([0]-1)*4+[1] 'th rub
  // 240: it's the nth rub
  // a rub is 1/4 of a hizb, and a hizb is 1/2 of a juz, thus a rub is 1/8 of a juz.
  if      (rub.includes('//')) { return __pair2idx(MAX_RUB / MAX_JUZ  /* 8 */, MAX_JUZ,  rub.split('//')) }
  else if (rub.includes('/'))  { return __pair2idx(MAX_RUB / MAX_HIZB /* 4 */, MAX_HIZB, rub.split('/'))  }
  else {
    if (+rub > MAX_RUB) { return }
    return +rub
  }
}

function rubs_to_ayat (strub, enrub) {  // each is 1-240 or 1/1-60/4 or 1//1-30//8.
  if (strub == null) { return [null, null] }
  const stidx = _rub2idx(strub)
  const enidx = _rub2idx(enrub)
  if (stidx == null || enidx == null) { return [null, null] }
  let st = rubs[(stidx || 1) - 1] + 1
  let en = rubs[ enidx || 240   ]
  return [st, en]
}

function _hizb2idx (hizb) {  // 1-60 or 1/1-30/2.
  // 30/2: [0] is juz, [1] is 1/2; i.e., it's the ([0]-1)*2+[1] 'th hizb
  // 60: it's the nth hizb
  // a rub is 1/4 of a hizb, and a hizb is 1/2 of a juz, thus a rub is 1/8 of a juz.
  if (hizb.includes('/')) { return __pair2idx(MAX_HIZB / MAX_JUZ /* 2 */, MAX_JUZ, hizb.split('/')) }
  else {
    if (+hizb > MAX_HIZB) { return }
    return +hizb
  }
}

function hizbs_to_ayat (sthizb, enhizb) {  // each is 1-240 or 1/1-60/4 or 1//1-30//8.
  if (sthizb == null) { return [null, null] }
  const stidx = _hizb2idx(sthizb)
  const enidx = _hizb2idx(enhizb)
  if (stidx == null || enidx == null) { return [null, null] }
  // we multiply by 4, as we have only data for rubs.
  const ratio = MAX_RUB / MAX_HIZB  // 4
  let st = rubs[((stidx || 1) - 1) * ratio] + 1
  let en = rubs[((enidx || 60)   ) * ratio]
  return [st, en]
}

const _color_values = {
  t: 'taj', taj: 'taj', tajweed: 'taj',
  b: 'bas', bas: 'bas', basic: 'bas',
  n: 'no',  no: 'no',   none: 'no',
}

function parse_color (color) {
  return _color_values[ color.toLowerCase() ]
}

const _quizmode_values = {
  i: 'imla', imla: 'imla', imlaai: 'imla',
  u: 'uthm', uthm: 'uthm', uthmani: 'uthm',
}

function parse_quizmode (quizmode) {
  return _quizmode_values[ quizmode.toLowerCase() ]
}

function parse_mv (mv) {
  mv = mv.toLowerCase()
  if (mv == ''
   || mv == 'b') { return 'bottom' }
  if (mv == 'r') { return 'right' }
  if (mv == 'l') { return 'left' }
}

function _ligilumilo (params) {
  let st; let en  // start aaya and end aaya
  // possible params:
  // - p: page. 1-604.
  // - s: sura, an entire sura. 1-114.
  // - j: juz,  an entire juz.  1-30.
  // - h: hizb, an entire hizb. 1-60  or 1/1-30/2.
  // - r: rub,  an entire rub.  1-240 or 1/1-60/4 or 1//1-30//8.
  // - k: ruku,  an entire ruku.
  // - ### => number of aaya in the Quran (1-6236)
  // - ##/### => number of sura and number of aaya in it
  //
  // all previous parameters can be paired; e.g., r=1-2 means to the end of the 2nd rub.
  //
  let a = 0; let b = 0
  // - b: before, a number of ayat to add before whatever you select. 0-inf.
  // - a: after,  a number of ayat to add before whatever you select. 0-inf.
  let dark             // dark mode: d/dark; l/light (default).
  let color = 'taj'    // color of text: c/color = t/taj/tajweed (default); b/bas/basic; n/no/none.
  let mv = 'bottom'    // position of buttons: m/mv/mvbtns = b (bottom; default); r (right); l (left).
  let quizmode         // quiz mode: q/qz/quizmode = u/uthm/uthmani (no-typing; default); i/imla/imlaai (typing)
  let byword           // imlaai-mode feedback rate; default); byword (true)
  let nolinebreaks     // uthmani-mode linebreaks between ayat (default: linebreaks)
  let qari             // audio recitation qari's id
  let qariurl          // user-provided audio recitation base_url
  let teacher          // teacher mode (audio recitation before ayah): t/teach/teacher (true); n/noteach/noteacher (false; default)
  let disableteacher   // remove teacher mode selector from the UI, teacher mode can still be set from the URL: dt/disableteacher
  let disablequizmode  // remove quiz mode selector from the UI, quiz mode can still be set from the URL: dq/disablequizmode
  let highcontrast     // high-contrast, dark colorscheme
  let cn               // continuation; ie, append a "phrase" from the next aaya if in the same sura
  let zz               // enable embedded integration: zz (cannot be disabled if enabled)
  params
    .slice(1)  // remove the first character (`?` or `#`)
    .split('&')
    .map(p => p.split('='))
    //.reduce((obj, cur, i) => { i == 0? {} : (obj[cur[0]] = cur[1], obj), {})
    .forEach((e, i) => {
      const is_of = (...params) => params.includes(e[0])
           if (is_of('dark', 'd')) { dark = true  }
      else if (is_of('light', 'l')) { dark = false }
      else if (is_of('color', 'c')) { color = parse_color(e[1]) }
      else if (is_of('mvbtns', 'mv', 'm')) { mv = parse_mv(e[1]) }
      else if (is_of('quizmode', 'qz', 'q')) { quizmode = parse_quizmode(e[1]) }
      else if (is_of('byword')) { byword = true }
      else if (is_of('byletter')) { byword = false }
      else if (is_of('linebreaks')) { nolinebreaks = false }
      else if (is_of('nolinebreaks')) { nolinebreaks = true }
      else if (is_of('t', 'teach', 'teacher')) { teacher = true }
      else if (is_of('n', 'noteach', 'noteacher')) { teacher = false }
      else if (is_of('dt', 'disableteacher')) { disableteacher = true }
      else if (is_of('dq', 'disablequizmode')) { disablequizmode = true }
      else if (is_of('hc', 'highcontrast')) { highcontrast = true }
      else if (is_of('cn')) { cn = true }
      else if (is_of('qari')) { qari = e[1] }
      else if (is_of('qariurl')) { qariurl = e[1] }
      else if (is_of('zz')) { zz = true }
      else if (is_of('a')) { a = +e[1] }
      else if (is_of('b')) { b = +e[1] }
      else if (is_of('p')) { [st, en] = pages_to_ayat(...range_to_pair(e[1])) }
      else if (is_of('s')) { [st, en] = suras_to_ayat(...range_to_pair(e[1])) }
      else if (is_of('r')) { [st, en] =  rubs_to_ayat(...range_to_pair(e[1])) }
      else if (is_of('h')) { [st, en] = hizbs_to_ayat(...range_to_pair(e[1])) }
      else if (is_of('j')) { [st, en] =  juzs_to_ayat(...range_to_pair(e[1])) }
      else if (is_of('k')) { [st, en] = rukus_to_ayat(...range_to_pair(e[1])) }
      else                 { [st, en] =  ayat_to_ayat(...range_to_pair(e[0])) }
    })
  let opts = { st:null, en:null, cn, dark, color, mv, quizmode, disablequizmode, byword, nolinebreaks, qari, qariurl, teacher, disableteacher, highcontrast, zz }
  if (st == null || en == null) { return opts }
  st -= b; en += a
  if (st <= 0)    { st = 1    }
  if (en >  6236) { en = 6236 }
  opts = {...opts, st, en}
  return opts
}

function ligilumi () {
  const opts = _ligilumilo(window.location.hash || window.location.search)
  //
  opts.quizmode = opts.quizmode != null? opts.quizmode : Qid('quizmode').value
  Qid('quizmode').value = opts.quizmode
  //
  if (opts.highcontrast) {
    Qid('body').classList.add('highcontrast')
  }
  delete opts.highcontrast
  //
  Qid('darkmode_input').checked = opts.dark
  Qid('darkmode_input').onchange()
  delete opts.dark
  //
  Qid('teacher_input').checked = opts.teacher
  //
  Qid('qaris').value = opts.qari
  if (!Qid('qaris').value) { Qid('qaris').value = '' }  // if unset or is a bad value
  Qid('qaris').oninput()
  //
  if (opts.qariurl) { Qid('qaris').value = '_' }  // an invalid value to hide "With audio"
  Qid('qariurl').value = opts.qariurl ? opts.qariurl : ''
  //
  Qid('textclr_input').value = opts.color
  Qid('textclr_input').onchange()
  delete opts.color
  //
  Qid('mvbtns_input').value = opts.mv
  Qid('mvbtns_input').onchange()
  delete opts.mv
  //
  Qid('feedbackrate').value = opts.byword? 'word' : ''
  Qid('feedbackrate').onchange()
  delete opts.byword
  //
  Qid('linebreaks_input').checked = !opts.nolinebreaks
  Qid('linebreaks_input').onchange()
  delete opts.nolinebreaks
  //
  const hide = (e) => e.style.display = 'none'
  //
  if (opts.disableteacher) { hide(Qid('teacher_option')) }
  delete opts.disableteacher
  //
  if (opts.disablequizmode) {
    hide(Qid('quizmode_option'))
    Qall('.mode_options_title').forEach(hide)
  }
  delete opts.disablequizmode
  //
  // if no aayat are selected, only change the provided preferences
  if (opts.st == null || opts.en == null) { return }
  recite(opts)
}

// vim: set sw=2 ts=2 et fdm=marker colorcolumn=80:
