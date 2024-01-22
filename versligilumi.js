// ligilumi: to parse url parameters
// verso: a verse
// versligilumi: parsing verses (not preferences) url params

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
  if (x === '') { return [null, null] }
  let xs = x.split('-')
  if (xs.length === 1 && xs.every(is_valid_pair)) { return [x, x] }
  if (xs.length === 2 && xs.every(is_valid_pair)) { return  xs    }
  return [null, null]
}

function suras_to_ayat (stsura, ensura) {  // each is 1-114
  if (stsura === '') { stsura =   '1' }
  if (ensura === '') { ensura = '114' }
  if (!is_number(stsura) || !is_number(ensura)) { return }
  stsura = +stsura || 1
  ensura = +ensura || MAX_SURA
  if (stsura < 1        || ensura < 1       ) { return }
  if (stsura > MAX_SURA || ensura > MAX_SURA) { return }
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
    // neither can be negative because of the earlier range_to_pair's split('-')
    const [sura, aaya] = [ +a[0], +a[1] ]
    if (isNaN(sura) || isNaN(aaya)) { return }
    if (sura < 1 || sura > MAX_SURA) { return }
    const max_aaya = suar_length[sura - 1]
    const clamped_aaya = Math.max(1, Math.min(max_aaya, aaya))
    // that clamps the aaya number to the valid range,
    // so zero is the first aaya, and 300 is the last aaya in the sura.
    return start_(sura - 1) + clamped_aaya
  }
  else {
    if (+aya > MAX_AYA) { return }
    return +aya
  }
}

function ayat_to_ayat (staya, enaya) {  // each is 1-6236 or 1/7 (sura/aya)
  if (!staya) { return }
  let st = _aya2idx(staya)
  let en = _aya2idx(enaya)
  if (st == null || en == null) { return }
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
  if (struku == null) { return }
  let stpair = _ruku2idx(struku)
  let enpair = _ruku2idx(enruku)
  if (stpair == null || enpair == null) { return }
  return [stpair[0], enpair[1]]
}

function pages_to_ayat (stpage, enpage) {  // each is 1-604
  if (stpage == null) { return }
  stpage = +stpage || 1; enpage = +enpage || MAX_PAGE
  if (stpage > MAX_PAGE || enpage > MAX_PAGE) { return }
  let st = pages[+stpage - 1] + 1
  let en = pages[+enpage]
  return [st, en]
}

function juzs_to_ayat (stjuz, enjuz) {  // each is 1-30
  if (stjuz == null) { return }
  stjuz = +stjuz || 1
  enjuz = +enjuz || MAX_JUZ
  if (stjuz > MAX_JUZ || enjuz > MAX_JUZ) { return }
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
  if (strub == null) { return }
  const stidx = _rub2idx(strub)
  const enidx = _rub2idx(enrub)
  if (stidx == null || enidx == null) { return }
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
  if (sthizb == null) { return }
  const stidx = _hizb2idx(sthizb)
  const enidx = _hizb2idx(enhizb)
  if (stidx == null || enidx == null) { return }
  // we multiply by 4, as we have only data for rubs.
  const ratio = MAX_RUB / MAX_HIZB  // 4
  let st = rubs[((stidx || 1) - 1) * ratio] + 1
  let en = rubs[((enidx || 60)   ) * ratio]
  return [st, en]
}

function _versligilumilo (params) {
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
  params
    .slice(1)  // remove the first character (`?` or `#`)
    .split('&')
    .map(p => p.split('='))
    //.reduce((obj, cur, i) => { i == 0 ? {} : (obj[cur[0]] = cur[1], obj), {})
    .forEach((e, i) => {
      const is_of = (...params) => params.includes(e[0])
           if (is_of('a')) { a = isNaN(+e[1]) ? a : +e[1] }
      else if (is_of('b')) { b = isNaN(+e[1]) ? b : +e[1] }
      else if (is_of('p')) { [st, en] = pages_to_ayat(...range_to_pair(e[1])) || [st, en] }
      else if (is_of('s')) { [st, en] = suras_to_ayat(...range_to_pair(e[1])) || [st, en] }
      else if (is_of('r')) { [st, en] =  rubs_to_ayat(...range_to_pair(e[1])) || [st, en] }
      else if (is_of('h')) { [st, en] = hizbs_to_ayat(...range_to_pair(e[1])) || [st, en] }
      else if (is_of('j')) { [st, en] =  juzs_to_ayat(...range_to_pair(e[1])) || [st, en] }
      else if (is_of('k')) { [st, en] = rukus_to_ayat(...range_to_pair(e[1])) || [st, en] }
      else                 { [st, en] =  ayat_to_ayat(...range_to_pair(e[0])) || [st, en] }
    })
  if (st == null || en == null) { return [null, null] }
  st -= b; en += a
  if (st <= 0)    { st = 1    }
  if (en >  6236) { en = 6236 }
  return [st, en]
}

function versligilumi () {
  const [st, en] = _versligilumilo(L.hash || L.search)
  //
  // if no ayat are selected
  if (st == null || en == null) { return }
  recite(st, en)
}
