// I know that the JS naming convention is to use lowerCamelCase for variables
// and functions. But I decided to use snake_case exclusively to make my
// functions visually distinct from those of JS, especially b/c I have functions
// with similar names, eg scroll_to_top. I also use it for variables and consts.
// The only exception is the Q* shorthand functions defined next.

// const say = console.log
const range = (i) => [...Array(i).keys()]

// Q*, el_*
function Q    (selector) { return document.querySelector(selector) }
function Qall (selector) { return document.querySelectorAll(selector) }
function Qid  (id)       { return document.getElementById(id) }

Element.prototype.Q    = Element.prototype.querySelector
Element.prototype.Qall = Element.prototype.querySelectorAll
// Element.prototype.Qid  = Element.prototype.getElementById

const L = location
const S = localStorage
// defaults are not stored:
//   qari = none
//   teacher = false
//   quizmode = uthmani
//   mvbtns = b
//   text colors = taj
//   feedbackrate = l (by letter)
//   colorize end of ayah = true
//   line breaks in uthmani = true
//   show tajweed legend = true
//   darkmode: follows the system (the default), unless changed by the user

const store_bool = (name, b=true) => { if (b) { S.setItem(name, 'Y') } else { S.removeItem(name) } }

const el_dark = Qid("dark")
const el_body = Qid("body")
const el_all = Qid("all")
const el_help = Qid("help")
const el_helptoggle = Qid("helptoggle")
const el_optiontoggle = Qid("optiontoggle")
const el_options = Qid("options")
const el_guide = Qid("guide")
const el_darkmode_option = Qid("darkmode_option")
const el_darkmode_input = Qid("darkmode_input")
const el_teacher_option = Qid("teacher_option")
const el_teacher_input = Qid("teacher_input")
const el_qaris = Qid("qaris")
const el_qariurl = Qid("qariurl")
const el_cn = Qid("cn")
const el_zz = Qid("zz")
const el_quizmode_option = Qid("quizmode_option")
const el_quizmode = Qid("quizmode")
const el_uthm_options = Qid("uthm_options")
const el_uthm_options_title = Qid("uthm_options_title")
const el_tafsir = Qid("tafsir")
const el_mvbtns_input = Qid("mvbtns_input")
const el_textclr_input = Qid("textclr_input")
const el_ayatnum_input = Qid("ayatnum_input")
const el_linebreaks_input = Qid("linebreaks_input")
const el_tl_input = Qid("tl_input")
const el_imla_options = Qid("imla_options")
const el_imla_options_title = Qid("imla_options_title")
const el_feedbackrate = Qid("feedbackrate")
const el_helpcontent = Qid("helpcontent")
const el_player = Qid("player")
const el_preloader = Qid("preloader")
const el_title = Qid("title")
const el_selectors = Qid("selectors")
const el_sura_bgn = Qid("sura_bgn")
const el_aaya_bgn = Qid("aaya_bgn")
const el_sura_end = Qid("sura_end")
const el_aaya_end = Qid("aaya_end")
const el_ok = Qid("ok")
const el_header = Qid("header")
const el_zzignore = Qid("zzignore")
const el_new = Qid("new")
const el_repeat = Qid("repeat")
const el_end_of_header = Qid("end_of_header")
const el_tafsirhint = Qid("tafsirhint")
const el_uthm_txt = Qid("uthm_txt")
const el_imla_txt_container = Qid("imla_txt_container")
const el_imla_txt = Qid("imla_txt")
const el_endmsg = Qid("endmsg")
const el_zzback = Qid("zzback")
const el_mvbtns = Qid("mvbtns")
const el_prevaaya = Qid("prevaaya")
const el_prevjmla = Qid("prevjmla")
const el_prevword = Qid("prevword")
const el_nextword = Qid("nextword")
const el_nextjmla = Qid("nextjmla")
const el_nextaaya = Qid("nextaaya")
const el_tl = Qid("tl")
const el_N = Qid("N")
const el_X = Qid("X")
const el_R = Qid("R")
const el_Q = Qid("Q")
const el_L = Qid("L")
const el_W = Qid("W")
const el_J = Qid("J")
const el_T = Qid("T")
const el_tvc = Qid("tvc")
const el_tv = Qid("tv")
const el_tvx = Qid("tvx")


const __scroll_top = (el) => el.scrollTo({ top: 0 })
const __scroll_bot = (el) => el.scrollTo({ top: el.scrollHeight })

const body_scroll_to_top    = () =>   __scroll_top(el_body)
const body_scroll_to_bottom = () =>   __scroll_bot(el_body)
const imla_scroll_to_bottom = () => { __scroll_bot(el_body); __scroll_bot(el_imla_txt) }

const hide_el = (el) => { el.style.visibility = 'hidden';  el.style.opacity = '0' }
const show_el = (el) => { el.style.visibility = 'visible'; el.style.opacity = '1' }

// tr num & fields() {{{
// TODO see: https://stackoverflow.com/q/10726638

const filter_aaya_input = (n) =>  // remove non-numerals and convert numerals to Eastern Arabic
  n.toString()
      .replace(/[0٠]/g, '٠')
      .replace(/[1١]/g, '١')
      .replace(/[2٢]/g, '٢')
      .replace(/[3٣]/g, '٣')
      .replace(/[4٤]/g, '٤')
      .replace(/[5٥]/g, '٥')
      .replace(/[6٦]/g, '٦')
      .replace(/[7٧]/g, '٧')
      .replace(/[8٨]/g, '٨')
      .replace(/[9٩]/g, '٩')
      .replace(/[^٠١٢٣٤٥٦٧٨٩]/g, '')

const defilter_aaya_input = (n) =>  // convert numerals to ASCII
  n
      .replace(/٠/g, '0')
      .replace(/١/g, '1')
      .replace(/٢/g, '2')
      .replace(/٣/g, '3')
      .replace(/٤/g, '4')
      .replace(/٥/g, '5')
      .replace(/٦/g, '6')
      .replace(/٧/g, '7')
      .replace(/٨/g, '8')
      .replace(/٩/g, '9')

const sura_bgn_length = () => el_sura_bgn.value === '' ? 0  :         suar_length[+el_sura_bgn.value]
const sura_end_length = () => el_sura_end.value === '' ? 0  :         suar_length[+el_sura_end.value]
const sura_bgn_val    = () => el_sura_bgn.value === '' ? '' :                     +el_sura_bgn.value
const sura_end_val    = () => el_sura_end.value === '' ? '' :                     +el_sura_end.value
const aaya_bgn_val    = () => el_aaya_bgn.value === '' ? '' : +defilter_aaya_input(el_aaya_bgn.value)
const aaya_end_val    = () => el_aaya_end.value === '' ? '' : +defilter_aaya_input(el_aaya_end.value)

// }}}

// validate_aaya_sura_input {{{
// called oninput and onblur with the element; only called for {sura,aaya}_{bgn,end} inputs.
// sometimes updates the input fields. and enables #ok if the inputs are valid.
function validate_aaya_sura_input (ev) {
  const el = ev.target
  const blur = ev.type === 'blur'
  const is_aaya = el === el_aaya_bgn || el === el_aaya_end

  el_aaya_bgn.value = filter_aaya_input(el_aaya_bgn.value)
  el_aaya_end.value = filter_aaya_input(el_aaya_end.value)

  if (blur && is_aaya && el.value === '') {
    if (el === el_aaya_bgn) {
      if (el_sura_bgn.value !== '') { el.value = 0 }
    }
    else {  // el === el_aaya_end
      if (el_sura_end.value !== '') { el.value = 300 }
    }
  }

  const set_aaya_bgn = (n) => el_aaya_bgn.value = filter_aaya_input(+n)
  const set_aaya_end = (n) => el_aaya_end.value = filter_aaya_input(+n)

  // if the changed field is sura_bgn, make aaya_bgn 1 if empty,
  // and update sura_end if empty or is before sura_bgn
  if (!blur && el === el_sura_bgn) {
    if (aaya_bgn_val() === '') { set_aaya_bgn(1) }
    if (sura_end_val() === '' || sura_end_val() < sura_bgn_val()) {
      el_sura_end.value = sura_bgn_val()
      set_aaya_end(sura_end_length())
    }
  }
  // if the changed field is sura_end, make aaya_end the last aya,
  // and update sura_bgn if empty or is after sura_end
  else if (!blur && el === el_sura_end) {
    set_aaya_end(sura_end_length())
    if (sura_bgn_val() === '' || (sura_end_val() !== '' && sura_end_val() < sura_bgn_val())) {
      el_sura_bgn.value = sura_end_val()
      set_aaya_bgn(1)
    }
  }

  // make sure ayat are within limits:

  // ayat upper-limits:
  if (aaya_bgn_val() > sura_bgn_length()) { set_aaya_bgn(sura_bgn_length()) }
  if (aaya_end_val() > sura_end_length()) { set_aaya_end(sura_end_length()) }

  // ayat lower-limits:
  if (aaya_bgn_val() === 0) { set_aaya_bgn(1) }
  if (aaya_end_val() === 0) { set_aaya_end(1) }
  // '' is checked for in the onblur case above
  // a negative sign is not allowed to be entered

  if (sura_bgn_val() !== '' && sura_end_val() !== '' &&
      aaya_bgn_val() !== '' && aaya_end_val() !== ''
  ) {
    // console.log('valid', sura_bgn_val(), sura_end_val(), aaya_bgn_val(), aaya_end_val())
    el_ok.disabled = false
  }
  else {
    // console.log('invalid')
    el_ok.disabled = true
  }
}
// }}}

const audio = (function () {  // {{{
  let list
  let base_url
  let cur_idx

  function index (i) { return i != null ? i : cur_idx }

  function invalid_state (idx) {
    idx = index(idx)
    return idx == null || idx < 0 || !base_url || !list || idx >= list.length
  }

  function audio_url (idx) {
    idx = index(idx)
    if (invalid_state(idx)) { return }
    return base_url + list[idx] + '.mp3'
  }

  function fetch (idx) {
    idx = index(idx)
    if (invalid_state(idx)) { return }
    el_preloader.src = audio_url(idx)
  }

  function play () {
    if (invalid_state()) { return }
    // el_title.innerText = list[cur_idx]  // for debugging
    el_player.src = audio_url()
    el_player.addEventListener('loadeddata', () => fetch(cur_idx + 1))
    el_player.play()
  }

  function set_idx (i) { cur_idx = i; fetch() }

  function show_or_hide_player () {
    invalid_state() ? hide_el(el_player) : show_el(el_player)
  }

  function update_qari (qari) {
    base_url = qari? `https://www.everyayah.com/data/${qari}/` : undefined
    fetch()
  }

  return {

    update_qari: function (qari) {
      update_qari(qari)
      show_or_hide_player()
    },

    init: function (qari, qariurl) {
      update_qari(qari)
      if (!qari && qariurl) {
        base_url = qariurl.endsWith('/') ? qariurl : qariurl + '/'
      }
      set_idx(0)
    },

    fill: function (ayat) {
      list = ayat
      set_idx(0)
      show_or_hide_player()
    },

    play: function (idx) {
      if (idx != null) { set_idx(idx) }
      show_or_hide_player()
      play()
    },

    set_index: function (i) { set_idx(i) },
    next: function () { set_idx(cur_idx + 1) },
    back: function () { set_idx(cur_idx - 1) },

  }
})()  // }}}

// kind_of_portion is: 'a' on aaya boundary; 'j' on waqf boundary; '' otherwise. {{{
function kind_of_portion (last_two_chars) {
  const last_one_char = last_two_chars.slice(-1)
  return last_one_char  === ''  ? 'a' :  // start of text
         last_one_char  === '\n'? 'a' :  // end of aaya
         last_two_chars.match(/[\u06D6-\u06DC]\t/) ? 'j' :  // waqf signs
         ''  // normal word
}  // }}}

function valid_inputs (sura_bgn, aaya_bgn, sura_end, aaya_end) {  // {{{
  return (
    sura_bgn !== '' && aaya_bgn !== '' &&
    sura_end !== '' && aaya_end !== '' &&
    sura_bgn <= sura_end &&
    (aaya_bgn <= aaya_end || sura_bgn < sura_end) &&
    1 <= aaya_bgn && aaya_bgn <= suar_length[sura_bgn] &&
    1 <= aaya_end && aaya_end <= suar_length[sura_end]
  )
}  // }}}

function zz_set (prop, val) {
  prop = 'zz_set_'+prop
  if (prop in parent) { parent[prop](val) }
}

function change_qari () {
  const val = el_qaris.value
  if (val !== '') { S.setItem('qari', val) } else { S.removeItem('qari') }
  audio.update_qari(val)
  zz_set('qari', val)
}

function change_quizmode () {
  zz_set('quizmode', el_quizmode.value)
  store_bool('imla', el_quizmode.value === 'imla')
  if (el_quizmode.value === 'imla') {
    /* hide */ el_uthm_options.style.display = 'none'
    /* show */ el_imla_options.style.display = 'block'
    el_tafsirhint.hidden = true
  }
  else {  /* uthmani */
    /* hide */ el_imla_options.style.display = 'none'
    /* show */ el_uthm_options.style.display = 'block'
    el_tafsirhint.hidden = el_selectors.hidden
  }
}

// removes tashkeel and ayat numbers
const remove_imla_additions = (str) =>
  str.replace(/[\u064B-\u0652\xA0\u06DD٠-٩]+/g, '')

function count_char (str, ch) {
  return str.replace(new RegExp('[^'+ch+']+', 'g'), '').length
}

const imlafilter_byletter = (val) => val
const imlafilter_byword   = (val) => val.replace(/\S*$/, '')  // only check after space or newline
const imlafilter_byaaya   = (val) => val.replace(/[^\n]*$/, '')  // only check after newline

window.imlafilter = imlafilter_byletter  // the default

function change_feedbackrate () {
  const fb = el_feedbackrate.value
  window.imlafilter = fb === 'a' ? imlafilter_byaaya
                    : fb === 'w' ? imlafilter_byword
                    : imlafilter_byletter
  if (el_imla_txt.value && el_imla_txt.oninput) { el_imla_txt.oninput() }
  if (fb === 'l') { S.removeItem('fbrate') } else { S.setItem('fbrate', fb) }
  zz_set('feedbackrate', fb)
}

// for now, assume no tashkeel (and remove it if found)
// later: check the tashkeel the user entered against the correct text, while ignoring the order of shadda
const imla_match = (correct, input, ifilter=window.imlafilter) =>
  remove_imla_additions(correct).startsWith(remove_imla_additions(ifilter(input)))

const sync_uthm_class_with = (cls, pred) => el_uthm_txt.classList.toggle(cls, pred)

function change_tajweed () {
  const tval = el_textclr_input.value
  store_bool('notajweed', tval !== 'taj')  // TODO: parts
  sync_uthm_class_with('letter-parts',   tval === 'bas')
  sync_uthm_class_with('letter-nocolor', tval === 'no')
  zz_set('tajweed', tval.slice(0,1))
}

function change_teacher () {
  const teacher = el_teacher_input.checked
  store_bool('teacher', teacher)
  zz_set('teacher', teacher)
}

function change_ayatnum () {
  const noayatnum = !el_ayatnum_input.checked
  store_bool('noayatnumcolor', noayatnum)
  sync_uthm_class_with('ayat-nocolor', noayatnum)
  zz_set('ayatnum', !noayatnum)
}

function change_linebreaks() {
  const nb = !el_linebreaks_input.checked
  store_bool('nolinebreaks', nb)
  sync_uthm_class_with('nb', nb)
  zz_set('linebreaks', !nb)
}

function change_dark () {
  const dark = el_darkmode_input.checked
  S.setItem('dark', dark ? 'Y' : 'N')
  el_dark.checked = dark
  zz_set('dark', dark)
}

function change_mvbtns () {
  const mv = el_mvbtns_input.value
  if (mv === 'b') { S.removeItem('mvbtns') } else { S.setItem('mvbtns', mv) }
  const mv_cls =
    mv === 'r' ? 'sidebtns rightside' :
    mv === 'l' ? 'sidebtns leftside'  :
                 ''  /* no class for 'bottom' */
  el_mvbtns.className = mv_cls
  el_uthm_txt.classList.toggle('sidebtns', mv_cls)
  el_tl.classList.toggle('right', mv === 'l')
  zz_set('mvbtns', mv)
}

function change_tafsir () {
  const t = el_tafsir.value
  if (t === 'ar_muyassar') { S.removeItem('tafsir') } else { S.setItem('tafsir', t) }
  zz_set('tafsir', t)
}

function change_tajweedlegend () {
  store_bool('notajweedlegend', !el_tl_input.checked)
  if (el_tl_input.checked) {
    if (!el_uthm_txt.hidden) {
      el_tl.style.display = ''
    }
  }
  else {
      if (el_tl.getAttribute('aria-expanded') === 'true') { el_tl.onclick({}) }  // close
      el_tl.style.display = 'none'
  }
}

function decode_contact () {
  let xyz = Qid('xyz')  // do NOT change to el_xyz; it's not defined in .index.html thus this const is not created
  let mia_nomo = Q('body').innerHTML.match(/github[.]com\/([a-z0-9]+)\//)[1]
  xyz.innerHTML = mia_nomo + String.fromCharCode(1<<6) + 'pro' + (''+(!![]))[+![]] + 'moc.liamno'.split('').reverse().join('')
  xyz.href = xyz.innerHTML.slice(16,20) + 'to' + String.fromCharCode('xyz'.charCodeAt(1<<1)^0O100) + xyz.innerHTML
  // if you know a better way, please let me know!
}

function make_title (sura_bgn, aaya_bgn, sura_end, aaya_end) {  // {{{

  const nbsp = '\xa0'
  // all numbers are 1-based
  sura_bgn = +sura_bgn
  aaya_bgn = +aaya_bgn
  sura_end = +sura_end
  aaya_end = +aaya_end
  const s_bgn_len = suar_length[sura_bgn - 1]
  const s_end_len = suar_length[sura_end - 1]
  const s_bgn_txt = suar_name[sura_bgn - 1]
  const s_end_txt = suar_name[sura_end - 1]
  // converts to Eastern Arabic numerals, and state the first and last in words
  const a_bgn_txt = aaya_bgn === 1? 'الأولى' : aaya_bgn === s_bgn_len? filter_aaya_input(aaya_bgn) + nbsp+'الأخيرة' : filter_aaya_input(aaya_bgn)
  const a_end_txt = aaya_end === 1? 'الأولى' : aaya_end === s_end_len? filter_aaya_input(aaya_end) + nbsp+'الأخيرة' : filter_aaya_input(aaya_end)
  //
  if (sura_bgn === sura_end) {  // if exactly one aaya
    if (aaya_bgn === aaya_end) {
      return `تسميع الآية${nbsp}${a_bgn_txt} من${nbsp}سورة${nbsp}${s_bgn_txt}`
    }
    if (aaya_end === aaya_bgn + 1) {  // if exactly two ayat
      return `تسميع الآيتين${nbsp}${a_bgn_txt} و${a_end_txt} من${nbsp}سورة${nbsp}${s_bgn_txt}`
    }
    if (aaya_bgn === 1 && aaya_end === s_end_len) {  // if one complete sura
      return `تسميع سورة ${s_bgn_txt} كاملة`
    }
    // otherwise: one partial sura
    return `تسميع سورة${nbsp}${s_bgn_txt} من${nbsp}الآية${nbsp}${a_bgn_txt} حتى${nbsp}الآية${nbsp}${a_end_txt}`
  }
  // more than one sura:
  if (aaya_bgn === 1 && aaya_end === s_end_len) {  // if multiple complete suar
    if (sura_end === sura_bgn + 1) {  // if exactly two
      return `تسميع سورتي ${s_bgn_txt} و${s_end_txt} كاملتين`
    }
    // otherwise: more than two (one is handled previously)
    return `تسميع السور من${nbsp}${s_bgn_txt} حتى${nbsp}${s_end_txt}`
  }
  // otherwise
  return `تسميع من${nbsp}سورة${nbsp}${s_bgn_txt} الآية${nbsp}${a_bgn_txt} حتى${nbsp}سورة${nbsp}${s_end_txt} الآية${nbsp}${a_end_txt}`
}  // }}}

// vim: set sw=2 ts=2 et fdm=marker colorcolumn=80:
