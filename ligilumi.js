// ligilumi: reading url parameters
function range_to_pair (x) {
  let xs = x.split('-')
  return xs.length === 2 ? xs : xs.length === 1 ? [x, x] : [null, null]
}

const MAX_JUZ  = 30
const MAX_HIZB = 60
const MAX_RUB  = 240
const MAX_AYA  = 6236
const MAX_SURA = 114
const MAX_PAGE = 604
const MAX_RUKU = 556

function suras_to_ayat (stsura, ensura) {  // each is 1-114
  if (stsura == null) { return [null, null] }
  stsura = +stsura || 1; ensura = +ensura || MAX_SURA
  if (stsura > MAX_SURA || ensura > MAX_SURA) { return [null, null] }
  const st = start_(stsura-1) + 1
  const en = start_(ensura-1) + suar_length[ensura-1]
  return [st, en]
}
function idx2aya (idx) {  // 0-6235
  if (idx < 0 || idx > 6236) { return [null, null] }
  const s = [...Array(114).keys()].find(s => idx >= start_(s) && idx < start_(s+1))
  return [s+1, idx - start_(s) + 1]
}


function _aya2idx (aya) {  // 1-6236 or 1/7
  if (aya.includes('/')) {
    let a = aya.split('/');
    if (a.length !== 2 || +a[0] > MAX_SURA || +a[1] > suar_length[+a[0]-1]) { return }
    return start_(+a[0] - 1) + +a[1]
  }
  else {
    if (+aya > MAX_AYA) { return }
    return +aya
  }
}

function ayat_to_ayat (staya, enaya) {  // each is 1-6236 or 1/7 (sura/aya)
  if (staya == null) { return [null, null] }
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
  stjuz = +stjuz || 1; enjuz = +enjuz || MAX_JUZ
  if (stjuz > MAX_JUZ || enjuz > MAX_JUZ) { return [null, null] }
  // we multiply by 8, as we have only data for rubs.
  const ratio = MAX_RUB / MAX_JUZ  // 8
  let st = rubs[((stjuz || 1)      - 1) * ratio] + 1
  let en = rubs[((enjuz || MAX_JUZ)   ) * ratio]
  return [st, en]
}

function _rub2idx (rub) {  // 1-240 or 1/1-60/4 or 1//1-30//8.
  // 30//8: [0] is juz, [1] is 1/8; i.e., it's the ([0]-1)*8+[1] 'th rub
  // 60/4: [0] is hizb, [1] is 1/4; i.e., it's the ([0]-1)*4+[1] 'th rub
  // 240: it's the nth rub
  // a rub is 1/4 of a hizb, and a hizb is 1/2 of a juz, thus a rub is 1/8 of a juz.
  if (rub.includes('//')) {
    const ratio = MAX_RUB / MAX_JUZ  // 8
    let r = rub.split('//');
    if (r.length !== 2 || +r[0] > MAX_JUZ || +r[1] > ratio) { return }
    return (+r[0] - 1)*ratio + +r[1] + 1
  }
  else if (rub.includes('/')) {
    const ratio = MAX_RUB / MAX_HIZB  // 4
    let r = rub.split('/');
    if (r.length !== 2 || +r[0] > MAX_HIZB || +r[1] > ratio) { return }
    return (+r[0] - 1)*ratio + +r[1] + 1
  }
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
  if (hizb.includes('/')) {
    const ratio = MAX_HIZB / MAX_JUZ  // 2
    let h = hizb.split('/');
    if (h.length !== 2 || +h[0] > MAX_JUZ || +h[1] > ratio) { return }
    return (+h[0] - 1)*ratio + +h[1] + 1
  }
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

function _ligilumilo (href) {
  let a = 0; let b = 0
  let st; let en
  let dark
  let color  // tajweed, bas, none
  // possible params:
  // - p: page. 1-604.
  // - s: sura, an entire sura. 1-114.
  // - j: juz,  an entire juz.  1-30.
  // - h: hizb, an entire hizb. 1-60  or 1/1-30/2.
  // - r: rub,  an entire rub.  1-240 or 1/1-60/4 or 1//1-30//8.
  // - b: before, a number of ayat to add before whatever you select. 0-inf.
  // - a: after,  a number of ayat to add before whatever you select. 0-inf.
  // - dark & light: dark mode
  // TODO: m for manzil & k for ruku & (maybe) t for thumn (1/8 of hizb)
  // TODO: acolor & anocolor: ayat-colors
  // TODO: audio
  href
    .split(/[#&]/)
    .map(p => p.split('='))
    //.reduce((obj, cur, i) => { i == 0? {} : (obj[cur[0]] = cur[1], obj), {})
    .forEach((e, i) => {
      if      (i == 0)       { return }  // ignore the file portion
      else if (e[0] === 'dark'  || e[0] === 'd') { dark = true  }
      else if (e[0] === 'light' || e[0] === 'l') { dark = false }
      else if (e[0] === 'color' || e[0] === 'c') { color = parse_color(e[1]) }
      else if (e[0] === 'a') { a = +e[1] }
      else if (e[0] === 'b') { b = +e[1] }
      else if (e[0] === 'p') { [st, en] = pages_to_ayat(...range_to_pair(e[1])) }
      else if (e[0] === 's') { [st, en] = suras_to_ayat(...range_to_pair(e[1])) }
      else if (e[0] === 'r') { [st, en] =  rubs_to_ayat(...range_to_pair(e[1])) }
      else if (e[0] === 'h') { [st, en] = hizbs_to_ayat(...range_to_pair(e[1])) }
      else if (e[0] === 'j') { [st, en] =  juzs_to_ayat(...range_to_pair(e[1])) }
      else if (e[0] === 'k') { [st, en] = rukus_to_ayat(...range_to_pair(e[1])) }
      else                   { [st, en] =  ayat_to_ayat(...range_to_pair(e[0])) }
    })
  if (st == null || en == null) { return [null, null, dark, color] }
  st -= b; en += a
  if (st <= 0)    { st = 1    }
  if (en >  6236) { en = 6236 }
  return [st, en, dark, color]
}

function ligilumi () {
  const [st, en, dark, color] = _ligilumilo(window.location.href)
  // if (dark || dark === false) {
  Qid('darkmode_input').checked = dark
  Qid('textclr_input').value = color || 'taj'  // the default
  chstyle()
  // }
  if (st == null || en == null) { return }
  recite(st, en, '', true)
}

// vim: set sw=2 ts=2 et fdm=marker colorcolumn=80: