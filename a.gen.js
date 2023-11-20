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

const el_dark = Qid("dark")
const el_body = Qid("body")
const el_all = Qid("all")
const el_help = Qid("help")
const el_helptoggle = Qid("helptoggle")
const el_optiontoggle = Qid("optiontoggle")
const el_options = Qid("options")
const el_darkmode_option = Qid("darkmode_option")
const el_darkmode_input = Qid("darkmode_input")
const el_teacher_option = Qid("teacher_option")
const el_teacher_input = Qid("teacher_input")
const el_qaris = Qid("qaris")
const el_qariurl = Qid("qariurl")
const el_zz = Qid("zz")
const el_cn = Qid("cn")
const el_guide = Qid("guide")
const el_quizmode_option = Qid("quizmode_option")
const el_quizmode = Qid("quizmode")
const el_uthm_options = Qid("uthm_options")
const el_uthm_options_title = Qid("uthm_options_title")
const el_mvbtns_input = Qid("mvbtns_input")
const el_textclr_input = Qid("textclr_input")
const el_ayatnum_input = Qid("ayatnum_input")
const el_linebreaks_input = Qid("linebreaks_input")
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
const el_uthm_txt = Qid("uthm_txt")
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


function __scroll_top (el) { el.scrollTo({ top: 0 }) }
function __scroll_bot (el) { el.scrollTo({ top: el.scrollHeight }) }

function body_scroll_to_top ()    { __scroll_top(el_body) }
function body_scroll_to_bottom () { __scroll_bot(el_body) }
function imla_scroll_to_bottom () { __scroll_bot(el_body); __scroll_bot(el_imla_txt) }

function hide_el (el) { el.style.visibility = 'hidden';  el.style.opacity =   '0%' }
function show_el (el) { el.style.visibility = 'visible'; el.style.opacity = '100%' }

// tr num & fields() {{{
// TODO see: https://stackoverflow.com/q/10726638

function filter_aaya_input (n) {  // remove non-numerals and convert numerals to Eastern Arabic
  return n.toString()
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
}
function defilter_aaya_input (n) {  // convert numerals to ASCII
  return n
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
}

const sura_bgn_length = () => el_sura_bgn.value === ''? 0  :         suar_length[+el_sura_bgn.value]
const sura_end_length = () => el_sura_end.value === ''? 0  :         suar_length[+el_sura_end.value]
const sura_bgn_val    = () => el_sura_bgn.value === ''? '' :                     +el_sura_bgn.value
const sura_end_val    = () => el_sura_end.value === ''? '' :                     +el_sura_end.value
const aaya_bgn_val    = () => el_aaya_bgn.value === ''? '' : +defilter_aaya_input(el_aaya_bgn.value)
const aaya_end_val    = () => el_aaya_end.value === ''? '' : +defilter_aaya_input(el_aaya_end.value)

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
         last_two_chars === '\u06DC\t'? 'j' :  // ARABIC SMALL HIGH SEEN
         last_two_chars === '\u06D6\t'? 'j' :  // ARABIC SMALL HIGH LIGATURE SAD WITH LAM WITH ALEF MAKSURA
         last_two_chars === '\u06D7\t'? 'j' :  // ARABIC SMALL HIGH LIGATURE QAF WITH LAM WITH ALEF MAKSURA
         last_two_chars === '\u06D8\t'? 'j' :  // ARABIC SMALL HIGH MEEM INITIAL FORM
         last_two_chars === '\u06DA\t'? 'j' :  // ARABIC SMALL HIGH JEEM
         last_two_chars === '\u06DB\t'? 'j' :  // ARABIC SMALL HIGH THREE DOTS
         ''
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
  audio.update_qari(val)
  zz_set('qari', val)
}

function change_quizmode () {
  zz_set('quizmode', el_quizmode.value)
  if (el_quizmode.value === 'imla') {
    /* hide */ el_uthm_options.style.display = 'none'
    /* show */ el_imla_options.style.display = 'block'
  }
  else {  /* uthmani */
    /* hide */ el_imla_options.style.display = 'none'
    /* show */ el_uthm_options.style.display = 'block'
  }
}

function remove_imla_additions (str) {
  // removes tashkeel and ayat numbers
  return str.replace(/[\u064B-\u0652\xA0\u06DD٠-٩]+/g, '')
}

function count_char (str, ch) {
  return str.replace(new RegExp('[^'+ch+']+', 'g'), '').length
}

function imlafilter_byletter (val) { return val }
function imlafilter_byword   (val) { return val.replace(/\S*$/, '') }  // only check after space or newline
function imlafilter_byaaya   (val) { return val.replace(/[^\n]*$/, '') }  // only check after newline

window.imlafilter = imlafilter_byletter  // the default

function change_feedbackrate () {
  window.imlafilter = el_feedbackrate.value === 'aaya' ? imlafilter_byaaya
                    : el_feedbackrate.value === 'word' ? imlafilter_byword
                    : imlafilter_byletter
  if (el_imla_txt.value && el_imla_txt.oninput) { el_imla_txt.oninput() }
  zz_set('feedbackrate', el_feedbackrate.value)
}

function imla_match (correct, input, ifilter=window.imlafilter) {
  // for now, assume no tashkeel (and remove it if found)
  return remove_imla_additions(correct).startsWith(remove_imla_additions(ifilter(input)))
  // later: check the tashkeel the user entered against the correct text, while ignoring the order of shadda
}

const sync_uthm_class_with = (cls, pred) => el_uthm_txt.classList.toggle(cls, pred)

function change_tajweed () {
  const tval = el_textclr_input.value
  sync_uthm_class_with('letter-parts',   tval === 'bas')
  sync_uthm_class_with('letter-nocolor', tval === 'no')
  zz_set('tajweed', tval.slice(0,1))
}

function change_ayatnum () {
  const ayatnum = el_ayatnum_input.checked
  sync_uthm_class_with('ayat-nocolor', !ayatnum)
  zz_set('ayatnum', ayatnum)
}

function change_linebreaks() {
  const nb = !el_linebreaks_input.checked
  sync_uthm_class_with('nb', nb)
  zz_set('linebreaks', !nb)
}

function change_dark () {
  const dark = el_darkmode_input.checked
  el_dark.checked = dark
  zz_set('dark', dark)
}

function change_mvbtns () {
  const mv = el_mvbtns_input.value
  const mv_cls =
    mv === 'right' ? 'sidebtns rightside' :
    mv === 'left'  ? 'sidebtns leftside'  :
                     ''  /* no class for 'bottom' */
  el_mvbtns.classList = mv_cls
  el_uthm_txt.classList.toggle('sidebtns', mv_cls)
  zz_set('mvbtns', mv.slice(0,1))
}

function decode_contact () {
  let xyz = Qid('xyz')  // do NOT change to el_xyz; it's not defined in .index.html thus this const is not created
  let mia_nomo = Q('body').innerHTML.match(/github[.]com\/([a-z0-9]+)\//)[1]
  xyz.innerHTML = mia_nomo + String.fromCharCode(1<<6) + 'pro' + (''+(!![]))[+![]] + 'moc.liamno'.split('').reverse().join('')
  xyz.href = xyz.innerHTML.slice(16,20) + 'to' + String.fromCharCode('xyz'.charCodeAt(1<<1)^0O100) + xyz.innerHTML
  // if you know a better way, please let me know!
}

function make_title (sura_bgn, aaya_bgn, sura_end, aaya_end) {  // {{{

  //// the longest strings (some are impossible):
  // return ["تسميع الآية ٣٠٠ الأخيرة من سورة العنكبوت", 'oneaaya']
  // return ["تسميع سورة العنكبوت كاملة", 'onesura']
  // return ["تسميع سورة العنكبوت من الآية ٣٠٠ حتى الآية ٣٠٠ الأخيرة", 'manyaaya']
  // return ["تسميع سورتي العنكبوت والعنكبوت كاملتين", 'twosura']
  // return ["تسميع السور من العنكبوت حتى العنكبوت", 'manysura']
  // return ["تسميع من سورة العنكبوت الآية ٣٠٠ الأخيرة حتى سورة العنكبوت الآية ٣٠٠ الأخيرة", 'manymany']
  // return ["تسميع الآيتين ٣٠٠ الأخيرة و٣٠٠ الأخيرة من سورة العنكبوت", 'twoaaya']

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
  const a_bgn_txt = aaya_bgn === 1? 'الأولى' : aaya_bgn === s_bgn_len?  filter_aaya_input(aaya_bgn) + ' الأخيرة' : filter_aaya_input(aaya_bgn)
  const a_end_txt = aaya_end === 1? 'الأولى' : aaya_end === s_end_len?  filter_aaya_input(aaya_end) + ' الأخيرة' : filter_aaya_input(aaya_end)
  //
  if (sura_bgn === sura_end) {
    // if exactly one aaya
    if (aaya_bgn === aaya_end) {
      return [`تسميع الآية${nbsp}${a_bgn_txt} من${nbsp}سورة${nbsp}${s_bgn_txt}`, '']
    }
    // if exactly two ayat
    if (aaya_end === aaya_bgn + 1) {
      return [`تسميع الآيتين${nbsp}${a_bgn_txt} و${a_end_txt} من${nbsp}سورة${nbsp}${s_bgn_txt}`, '']
    }
    // if one complete sura
    if (aaya_bgn === 1 && aaya_end === s_end_len) {
      return [`تسميع سورة ${s_bgn_txt} كاملة`, '']
    }
    // otherwise: one partial sura
    return [`تسميع سورة${nbsp}${s_bgn_txt} من${nbsp}الآية${nbsp}${a_bgn_txt} حتى${nbsp}الآية${nbsp}${a_end_txt}`, '']
  }
  // more than one sura:
  // if multiple complete suar
  if (aaya_bgn === 1 && aaya_end === s_end_len) {
    // if exactly two
    if (sura_end === sura_bgn + 1) {
      return [`تسميع سورتي ${s_bgn_txt} و${s_end_txt} كاملتين`, '']
    }
    // otherwise: more than two (one is handled previously)
    return [`تسميع السور من${nbsp}${s_bgn_txt} حتى${nbsp}${s_end_txt}`, '']
  }
  // otherwise
  return [`تسميع من${nbsp}سورة${nbsp}${s_bgn_txt} الآية${nbsp}${a_bgn_txt} حتى${nbsp}سورة${nbsp}${s_end_txt} الآية${nbsp}${a_end_txt}`, 'manymany']
}  // }}}

// vim: set sw=2 ts=2 et fdm=marker colorcolumn=80:
