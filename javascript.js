'use strict';

<<!!cat a.js>>
<<!!cat ligilumi.js>>

function start_reciting () {
  hide_selectors()
  el_nextword.focus()
  if (!valid_inputs(sura_bgn_val(), aaya_bgn_val(), sura_end_val(), aaya_end_val())) { return }
  const st = start_(sura_bgn_val()) + aaya_bgn_val()
  const en = start_(sura_end_val()) + aaya_end_val()
  recite(st, en, el_qaris.value)
}

function input_trigger_x (ev) {
  // this fn is connected to onkeyup and onmouseup. it handles three "events"

  const on_ayat = ev.target.id === 'aaya_bgn' || ev.target.id === 'aaya_end'
  const on_suar = ev.target.id === 'sura_bgn' || ev.target.id === 'sura_end'

  // Enter on suar/ayat selection: set focus on the next element:
  //   sura_bgn > aaya_bgn > sura_end > aaya_end > ok
  // also, on the last element, get the next (ie first) word
  if (ev.key === 'Enter' && (on_ayat || on_suar)) {
    (ev.target.id === 'sura_bgn'? el_aaya_bgn :
     ev.target.id === 'aaya_bgn'? el_sura_end :
     ev.target.id === 'sura_end'? el_aaya_end :
     ev.target.id === 'aaya_end'? el_ok       :
     1).focus()
    return
  }

  // Up or Down on an ayat-input, increase or decrease it
  if (on_ayat) {
    let el = Qid(ev.target.id)
    if (ev.key === 'ArrowUp')   { el.value = 1 + +defilter_aaya_input(el.value) }
    if (ev.key === 'ArrowDown') { el.value = 1 - +defilter_aaya_input(el.value) }
    validate_aaya_sura_input(ev)  // handles the filtering and the limits
    return
  }
}

function show_done () {
  if (el_endmsg.hidden && el_txt.innerHTML.length > 0) {
    el_endmsg.hidden = false
    show_selectors()
    confetti.start(1200, 50, 150)
    setTimeout(() => el_ok.focus(), 500)
    // // el_repeat.focus()
    // el_new.focus()
    return true
  }
  return false
}

function help_toggled ()   { setTimeout(scroll_to_top, 100) }
function option_toggled () {}  // TODO: scroll to top of options

function scroll_to_top ()    { window.scrollTo({ top: 0 }) }
function scroll_to_bottom () { window.scrollTo({ top: document.body.scrollHeight }) }

function hide_el (el) { el.style.visibility = 'hidden';  el.style.opacity =   '0%' }
function show_el (el) { el.style.visibility = 'visible'; el.style.opacity = '100%' }

function sync_ui (stpair, enpair, qari, preserve_url) {
  if (!preserve_url) { window.location.hash = stpair.join('/') + '-' + enpair.join('/') }
  //
  el_sura_bgn.value = stpair[0]-1; el_aaya_bgn.value = filter_aaya_input(stpair[1])
  el_sura_end.value = enpair[0]-1; el_aaya_end.value = filter_aaya_input(enpair[1])
  //
  el_qaris.value = qari  // if set thru url parameters
}

function init_audio (stpair, enpair, qari, preserve_url) {
  audio.init(qari)
  audio.fill(make_audio_list(stpair[0]-1, stpair[1], enpair[0]-1, enpair[1]))
}

function recite (st, en, qari, preserve_url) {

  const stpair = idx2aya(st-1)
  const enpair = idx2aya(en-1)
  sync_ui(stpair, enpair, qari, preserve_url)
  init_audio(stpair, enpair, qari, preserve_url)

  hide_selectors()
  el_txt.focus()

  let words = make_words_list(st, en)

  const fwd = function (kind) {
    let txt = ''
    const isnt_the_kind =
      kind === 'a'? (k) => k !== 'a' :
      kind === 'j'? (k) => k !== 'a' && k !== 'j' :
                    (k) => false
    if (words.length > 0) {
      let new_word_kind
      do {
        let new_word = words.shift()
        txt += new_word
        new_word_kind = kind_of_portion( new_word.slice(-2) )
      } while (isnt_the_kind(new_word_kind))
      if (new_word_kind === 'a') { audio.play_next() }
      el_txt.innerHTML += txt
    }
    else {
      show_done()
    }
    scroll_to_bottom()
  }

  const word_fwd = () => fwd('w')
  const aaya_fwd = () => fwd('a')
  const jmla_fwd = () => fwd('j')

  const word_bck = function (ev) {
    if (el_txt.innerHTML.length === 0) { return 'a' }
    if (!el_endmsg.hidden) { return 'a' }
    const last_word = el_txt.innerHTML.match(/(?:^|\t|<br>\n)([^\n\t]+(?:\t|<br>\n))$/)[1]
    words.unshift(last_word)
    el_txt.innerHTML = el_txt.innerHTML.substring(0, el_txt.innerHTML.length - last_word.length)
    if (last_word.match(/<br>\n$/)) { audio.back() }
    return kind_of_portion( el_txt.innerHTML.slice(-2) )
  }

  const aaya_bck = function (ev) {
    do { var c = word_bck() } while (c !== 'a')
  }

  const jmla_bck = function (ev) {
    do { var c = word_bck() } while (c !== 'a' && c !== 'j')
  }

  const input_trigger = function (ev) {

    const kb_mod = ev.shiftKey || ev.ctrlKey || ev.altKey
    const kb_fwd = ev.key === ' ' || ev.key === 'Enter' || ev.key === 'ArrowLeft'
    const kb_bck = ev.key === 'Backspace' || ev.key === 'ArrowRight'
    const not_on_input_field =  // not just ayat and suar
      ev.target.nodeName !== 'INPUT' && ev.target.nodeName !== 'SELECT'

    // Enter or Space, and the target is not input or select, get the next word
    // (ie, on the #ok button, or in the page with no element focused)
    // or mouse-click on the ok button

    if (ev.type === 'mouseup' && ev.target.id === 'ok') { word_fwd(); return }
    if (kb_fwd && !kb_mod && not_on_input_field)        { word_fwd(); return }
    if (kb_bck && !kb_mod && not_on_input_field)        { word_bck(); return }

    if (kb_fwd && kb_mod && not_on_input_field) { aaya_fwd(); return }
    if (kb_bck && kb_mod && not_on_input_field) { aaya_bck(); return }

    if (ev.key === '0' && not_on_input_field) { jmla_fwd(); return }
    if (ev.key === '1' && not_on_input_field) { jmla_bck(); return }

  }

  // both events are the "up" variants to disable repeating (holding down
  // the key, even for a few additional milliseconds by accident), which
  // prints a lot of words
  document.onkeyup = input_trigger
  el_nextaaya.onclick = aaya_fwd
  el_nextjmla.onclick = jmla_fwd
  el_nextword.onclick = word_fwd
  el_prevword.onclick = word_bck
  el_prevjmla.onclick = jmla_bck
  el_prevaaya.onclick = aaya_bck
}

el_ok.onclick  = start_reciting
// el_ok.onmouseup  = input_trigger

el_repeat.onmouseup = start_reciting
el_repeat.onclick   = start_reciting

function init_inputs () {
  el_sura_bgn.value   = el_aaya_bgn.value   = el_sura_end.value   = el_aaya_end.value   = ''
  el_sura_bgn.oninput = el_aaya_bgn.oninput = el_sura_end.oninput = el_aaya_end.oninput = validate_aaya_sura_input
  el_sura_bgn.onblur  = el_aaya_bgn.onblur  = el_sura_end.onblur  = el_aaya_end.onblur  = validate_aaya_sura_input
  el_sura_bgn.onkeyup = el_aaya_bgn.onkeyup = el_sura_end.onkeyup = el_aaya_end.onkeyup = input_trigger_x
}

const hide_selectors = function () {
  el_selectors.hidden = true
  el_header.hidden = false
  el_txt.innerHTML = ''
  el_endmsg.hidden = true
  el_ok.hidden = true
  el_mvbtns.hidden = false
}

const show_selectors = function () {
  el_selectors.hidden = false
  el_header.hidden = true
  el_ok.hidden = false
  el_mvbtns.hidden = true
}

const new_select = function () {
  show_selectors()
  el_txt.innerHTML = ''
  el_endmsg.hidden = true
}

el_new.onmouseup = new_select
el_new.onclick   = new_select

onload = function () {
  el_ok.disabled = true
  init_inputs()
  chstyle()  // to update the style, as we don't reset these
             // inputs, so they keep their values on refresh.
  decode_contact()
  ligilumi()
}

<<!!cat z.js>>

// vim: set sw=2 ts=2 et fdm=marker colorcolumn=80:
