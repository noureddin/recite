// I know that the JS naming convention is to use lowerCamelCase for variables
// and functions. But I decided to use snake_case exclusively to make my
// functions visually distinct from those of JS, especially b/c I have functions
// with similar names, eg scroll_to_top. I also use it for variables and consts.
// The only exception is the Q* shorthand functions defined next.

const range = (i) => [...Array(i).keys()]

// Q*, el_*
function Q    (selector) { return document.querySelector(selector) }
function Qall (selector) { return document.querySelectorAll(selector) }
function Qid  (id)       { return document.getElementById(id) }

Element.prototype.Q    = Element.prototype.querySelector
Element.prototype.Qall = Element.prototype.querySelectorAll
// Element.prototype.Qid  = Element.prototype.getElementById

function make_elem (tag, opts={}) {
  const el = document.createElement(tag)
  for (let opt in opts)
    if (opt === 'Dataset')
      for (let k in opts[opt])
        el.dataset[k] = opts[opt][k]
    else
      el[opt] = opts[opt]
  return el
}

function make_svgelem (tag, attrs={}, opts={}) {
  const el = document.createElementNS("http://www.w3.org/2000/svg", tag)
  for (let attr in attrs)
    el.setAttribute(attr, attrs[attr])
  return el
}

const spinner = make_svgelem('svg', { id: 'spinner-svg', viewBox: '-50 -50 100 100' })
spinner.appendChild(make_svgelem('circle', { id: 'spinner', cx: 0, cy: 0, r: 35, fill: 'none', 'stroke-width': '10', 'stroke-dasharray': '40 30' }))

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

<<!!bash -c 'for id in $(grep -Po "(?<=id=\")([^\"]+)(?=\")" .index.html); do echo "const el_$id = Qid(\"$id\")"; done'>>

const __scroll_top = (el) => el.scrollTo({ top: 0 })
const __scroll_bot = (el) => el.scrollTo({ top: el.scrollHeight })

const body_scroll_to_top    = () =>   __scroll_top(el_body)
const body_scroll_to_bottom = () =>   __scroll_bot(el_body)
const imla_scroll_to_bottom = () => { __scroll_bot(el_body); __scroll_bot(el_imla_txt) }

const hide_el = (el) => { el.style.visibility = 'hidden';  el.style.opacity = '0' }
const show_el = (el) => { el.style.visibility = 'visible'; el.style.opacity = '1' }

// tr num & fields() {{{
// TODO see: https://stackoverflow.com/q/10726638

const toarab = (n) =>  // remove non-numerals and convert numerals to Eastern Arabic
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

const toascii = (n) =>  // convert numerals to ASCII
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

const sura_bgn_length = () => el_sura_bgn.value === '' ? 0  : sura_length[+el_sura_bgn.value]
const sura_end_length = () => el_sura_end.value === '' ? 0  : sura_length[+el_sura_end.value]
const sura_bgn_val    = () => el_sura_bgn.value === '' ? '' :             +el_sura_bgn.value
const sura_end_val    = () => el_sura_end.value === '' ? '' :             +el_sura_end.value
const aaya_bgn_val    = () => el_aaya_bgn.value === '' ? '' :             +el_aaya_bgn.value
const aaya_end_val    = () => el_aaya_end.value === '' ? '' :             +el_aaya_end.value

const make_aayaat = (len) => range(len).map(a => `<option value="${a+1}">${toarab(a+1)}</option>`).join('')
const set_aayaat = (el, len, v) => {
  const oldval = aaya_bgn_val()
  el.innerHTML = make_aayaat(len)
  if (v) { el.value = v } else { el.value = len }
}

// }}}

// validate_aaya_sura_input {{{
// called oninput and onblur with the element; only called for {sura,aaya}_{bgn,end} inputs.
// may update the input fields.
function validate_aaya_sura_input (ev) {
  const el = ev.target
  const blur = ev.type === 'blur'
  const is_aaya = el === el_aaya_bgn || el === el_aaya_end
  //
  // if the changed field is sura_bgn
  if (!blur && el === el_sura_bgn) {
    set_aayaat(el_aaya_bgn, sura_bgn_length(), 1)
    if (sura_end_val() < sura_bgn_val()) {
      el_sura_end.value = sura_bgn_val()
      set_aayaat(el_aaya_end, sura_end_length())
    }
  }
  // if the changed field is sura_end
  else if (!blur && el === el_sura_end) {
    set_aayaat(el_aaya_end, sura_end_length())
    if (sura_end_val() < sura_bgn_val()) {
      el_sura_bgn.value = sura_end_val()
      set_aayaat(el_aaya_bgn, sura_bgn_length(), 1)
    }
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
    el_player.play().catch(() => {})
  }

  function set_idx (i) {
    const ii = +i
    if (isNaN(ii)) { return }
    cur_idx = ii
    fetch()
  }

  function show_or_hide_player () {
    invalid_state() ? hide_el(el_player) : show_el(el_player)
  }

  function update_qari (qari) {
    base_url = qari ? `https://www.everyayah.com/data/${qari}/` : undefined
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
    1 <= aaya_bgn && aaya_bgn <= sura_length[sura_bgn] &&
    1 <= aaya_end && aaya_end <= sura_length[sura_end]
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
  }
  else {  /* uthmani */
    /* hide */ el_imla_options.style.display = 'none'
    /* show */ el_uthm_options.style.display = 'block'
  }
  show_or_hide_tafsirhint()
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

function show_or_hide_tafsirhint () {
  // shown only if EITHER of these conditions is met:
  // - just finished quizzing in the Uthmani mode :: endmsg && uthm_txt
  // - previewing :: uthm_txt && repeat button is called 'ابدأ الاختبار'
  // - not started quizzing yet (or "New" is clicked) AND quizmode is Uthmani
  //   :: !endmsg && selectors && el_quizmode.value === 'uthm'
  // where endmsg = !el_endmsg.hidden and so on.
  //
  const EH = el_endmsg.hidden
  const UH = el_uthm_txt.hidden
  const SH = el_selectors.hidden
  const QI = el_quizmode.value !== 'uthm'
  const RE = !el_repeat.innerText.startsWith('ابدأ')
  el_tafsirhint.hidden = (UH || RE && EH) && (!EH || SH || QI)
  // (EH || UH) && (UH || RE)  ===  (UH || (EH && RE))

}

function show_or_hide_tajweedlegend () {
  // shown only when ALL of these conditions are met:
  // - tajweed legend is enabled :: el_tl_input.checked
  // - text is colored according to tajweed rules :: el_textclr_input.value === 'taj'
  // - currently quizzing, in the Uthmani mode :: !el_uthm_txt.hidden
  // also, when tajweed legend is disabled (!el_tl_input.checked), it's closed.
  //
  if (!el_tl_input.checked) {  // close and hide
    if (el_tl.getAttribute('aria-expanded') === 'true') { el_tl.onclick({}) }  // close
    el_tl.style.display = 'none'
  }
  else {
    el_tl.style.display =
      !el_uthm_txt.hidden && el_textclr_input.value === 'taj'
        ? ''      // show
        : 'none'  // hide
  }
}

function change_tajweed () {
  const tval = el_textclr_input.value
  const notaj = tval !== 'taj'
  store_bool('notajweed', notaj)  // TODO: parts
  sync_uthm_class_with('letter-parts',   tval === 'bas')
  sync_uthm_class_with('letter-nocolor', tval === 'no')
  el_tl_input.disabled = notaj
  el_tl_input.previousElementSibling.classList.toggle('disabled', notaj)  // its label
  show_or_hide_tajweedlegend()
  zz_set('tajweed', tval.slice(0,1))
}

function change_teacher () {
  const teacher = el_teacher.checked
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
  const t = el_tafsir_option.value
  if (t === 'ar_muyassar') { S.removeItem('tafsir') } else { S.setItem('tafsir', t) }
  const tsel = Qid('tsel');  if (tsel) { tsel.value = t }
  zz_set('tafsir', t)
}

function change_tajweedlegend () {
  store_bool('notajweedlegend', !el_tl_input.checked)
  show_or_hide_tajweedlegend()
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
  const s_bgn_len = sura_length[sura_bgn - 1]
  const s_end_len = sura_length[sura_end - 1]
  const s_bgn_txt = sura_name[sura_bgn - 1]
  const s_end_txt = sura_name[sura_end - 1]
  // converts to Eastern Arabic numerals, and state the first and last in words
  const a_bgn_txt = aaya_bgn === 1? 'الأولى' : aaya_bgn === s_bgn_len? toarab(aaya_bgn) + nbsp+'الأخيرة' : toarab(aaya_bgn)
  const a_end_txt = aaya_end === 1? 'الأولى' : aaya_end === s_end_len? toarab(aaya_end) + nbsp+'الأخيرة' : toarab(aaya_end)
  //
  if (sura_bgn === sura_end) {  // if exactly one sura
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
  // if two ayat crossing suar, ie last aaya of sura and the first aaya of the next sura
  if (sura_end === sura_bgn + 1 && aaya_bgn == s_bgn_len && aaya_end == 1) {
    return `تسميع الآية${nbsp}${a_bgn_txt} من سورة${nbsp}${s_bgn_txt} والآية ${a_end_txt} من سورة${nbsp}${s_end_txt}`
  }
  // otherwise
  return `تسميع من${nbsp}سورة${nbsp}${s_bgn_txt} الآية${nbsp}${a_bgn_txt} حتى${nbsp}سورة${nbsp}${s_end_txt} الآية${nbsp}${a_end_txt}`
}  // }}}

// vim: set sw=2 ts=2 et fdm=marker colorcolumn=80:
