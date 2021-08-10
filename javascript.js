let most_recent_parameters = []

function start_reciting () {
  const txt = el_quizmode.value === 'txt'
  hide_selectors(txt)
  el_nextword.focus()
  if (!valid_inputs(sura_bgn_val(), aaya_bgn_val(), sura_end_val(), aaya_end_val())) { return }
  const st = start_(sura_bgn_val()) + aaya_bgn_val()
  const en = start_(sura_end_val()) + aaya_end_val()
  recite(st, en, el_qaris.value, txt)
}

function restart_reciting () {
  // qari and txt can change.
  // Remember: most_recent_parameters = [st, en, qari, txt, zz]
  let [st, en, qari, txt, zz] = most_recent_parameters 
  qari = el_qaris.value
  txt = el_quizmode.value === 'txt'
  hide_selectors(txt)  // handles the change of quiz mode
  recite(st, en, qari, txt, zz)
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
  if (el_endmsg.hidden) {
    el_endmsg.hidden = false
    confetti.start(1200, 50, 150)
    if (el_zzback.hidden) {  /* not zz-mode */
      show_selectors()
      setTimeout(() => el_ok.focus(), 500)
    }
    else {  /* zz-mode */
      el_mvbtns.hidden = true
      setTimeout(() => el_zzback.focus(), 500)
    }
    return true
  }
  return false
}

function help_toggled () {
  setTimeout(scroll_to_top, 100)
}
function option_toggled () {
  // TODO: scroll to top of options
}

function scroll_to_top ()    { window.scrollTo({ top: 0 }) }
function scroll_to_bottom () { window.scrollTo({ top: document.body.scrollHeight }) }

function hide_el (el) { el.style.visibility = 'hidden';  el.style.opacity =   '0%' }
function show_el (el) { el.style.visibility = 'visible'; el.style.opacity = '100%' }

function sync_ui (stpair, enpair, qari, title, preserve_url) {
  if (!preserve_url) { window.location.hash = stpair.join('/') + '-' + enpair.join('/') }
  document.querySelector('title').innerHTML = title + ' | رسايت'
  //
  el_sura_bgn.value = stpair[0]-1; el_aaya_bgn.value = filter_aaya_input(stpair[1])
  el_sura_end.value = enpair[0]-1; el_aaya_end.value = filter_aaya_input(enpair[1])
  //
  el_qaris.value = qari  // if set thru url parameters; TODO
}

function init_audio (stpair, enpair, qari) {
  audio.init(qari)
  audio.fill(make_audio_list(stpair[0]-1, stpair[1], enpair[0]-1, enpair[1]))
}

function recite (st, en, qari, txt, zz) {
  const start = () => { _recite(st, en, qari, txt, zz) }
  if (txt) { load_imla(start) }
  else {  /* othmani, which is split into two parts */
    const n1 = is_in_first_half(st, en)
    const n2 = is_in_second_half(st, en)
    if (n1 && n2) { load_othm1(() => { load_othm2(start) }) }  // TODO: parallize
    else if (n1) { load_othm1(start) }
    else if (n2) { load_othm2(start) }
  }
}

function _recite (st, en, qari, txt, zz) {
  most_recent_parameters = [st, en, qari, txt, zz]

  const preserve_url = !!window.location.search || !!window.location.hash

  el_zzback.style.display = zz? 'block' : 'none'
  el_zzback.hidden = !zz
  el_zzignore.hidden = !zz
  el_new.hidden = !!zz  // only hide if ignore is shown

  const stpair = idx2aya(st-1)
  const enpair = idx2aya(en-1)
  const title = make_title(...stpair, ...enpair)
  el_title.innerHTML = title
  sync_ui(stpair, enpair, qari, title, preserve_url)
  init_audio(stpair, enpair, qari, preserve_url)

  hide_selectors(txt)
  if (txt) {
    el_txt_txt.focus()
    let correct_text = imalaai_ayat(st, en)
    let pasted = false

    const txt_changed = function () {
      const current_aaya_index = el_txt_txt.value.split('\n').length - 2

      if (!el_endmsg.hidden) { return }

      if (pasted) {
        el_txt_txt.value = el_txt_txt.value.replace(/ \u06dd/g, '\xa0\u06dd')
        // because NBSP is copied as normal, ASCII space
        pasted = false
      }

      if (correct_text.startsWith(el_txt_txt.value)) {
        el_txt_txt.classList = ''
        if (el_txt_txt.value.slice(-1) === '\n') {  // most likely basmala
          audio.play_index(current_aaya_index)
        }
      }

      else if (el_txt_txt.value.slice(-1) === '\n'
          && correct_text.startsWith(el_txt_txt.value.slice(0,-1) + '\xA0\u06dd'))
      {
        let x = el_txt_txt.value.length + 2
        while (correct_text.slice(x, x+1) !== '\n') { ++x }
        el_txt_txt.value = correct_text.slice(0, x+1)
        audio.play_index(current_aaya_index)
        if (el_txt_txt.value === correct_text) {
          show_done()
          scroll_to_bottom()
          el_txt_txt.disabled = true
          el_txt_txt.classList = 'done'
          el_new.focus()
        }
      }

      else {
        el_txt_txt.classList = 'wrong'
      }
    }

    el_txt_txt.addEventListener('input', txt_changed, false) // https://stackoverflow.com/a/14029861
    el_txt_txt.addEventListener('paste', (e) => { pasted = true })
    el_txt_txt.focus()

  }
  else {
    el_txt.focus()

    let words = make_words_list(st, en)

    const fwd = function (kind) {
      if (words.length === 0) { return }
      const isnt_the_kind =
        kind === 'a'? (k) => k !== 'a' :
        kind === 'j'? (k) => k !== 'a' && k !== 'j' :
                      (k) => false
      let new_word_kind, txt = ''
      do {
        let new_word = words.shift()
        txt += new_word
        new_word_kind = kind_of_portion( new_word.slice(-2) )
      } while (isnt_the_kind(new_word_kind))
      if (new_word_kind === 'a') { audio.play_next() }
      el_txt.innerHTML += txt
      if (words.length === 0) { show_done() }
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
    document.ondblclick = (ev) => { if (ev.target === el_txt || ev.target === Qid('body')) { word_fwd() } }
    el_nextaaya.onclick = aaya_fwd
    el_nextjmla.onclick = jmla_fwd
    el_nextword.onclick = word_fwd
    el_prevword.onclick = word_bck
    el_prevjmla.onclick = jmla_bck
    el_prevaaya.onclick = aaya_bck

  }
  if (zz) { parent.zz_show() }
}

el_ok.onclick  = start_reciting
// el_ok.onmouseup  = input_trigger

el_repeat.onmouseup = restart_reciting
el_repeat.onclick   = restart_reciting

function init_inputs () {
  el_sura_bgn.value   = el_aaya_bgn.value   = el_sura_end.value   = el_aaya_end.value   = ''
  el_sura_bgn.oninput = el_aaya_bgn.oninput = el_sura_end.oninput = el_aaya_end.oninput = validate_aaya_sura_input
  el_sura_bgn.onblur  = el_aaya_bgn.onblur  = el_sura_end.onblur  = el_aaya_end.onblur  = validate_aaya_sura_input
  el_sura_bgn.onkeyup = el_aaya_bgn.onkeyup = el_sura_end.onkeyup = el_aaya_end.onkeyup = input_trigger_x
}

const hide_selectors = function (txt) {
  el_selectors.hidden = true
  el_header.hidden = false
  el_endmsg.hidden = true
  el_ok.hidden = true
  if (txt) {
    el_txt_txt.value = ""
    el_txt_txt.disabled = false
    el_txt_txt.classList = ''
    el_txt_txt.hidden = false
    el_txt.hidden = true
    el_mvbtns.hidden = true
  }
  else {
    el_txt.hidden = false
    el_txt.innerHTML = ''
    el_mvbtns.hidden = false
    el_txt_txt.hidden = true
  }
}

const show_selectors = function () {
  el_selectors.hidden = false
  el_header.hidden = true
  el_ok.hidden = false
  el_mvbtns.hidden = true
  validate_aaya_sura_input({}) /* to enable #ok for easier repeating */
}

const clear_screen = function () {
  el_txt.innerHTML = ''
  el_txt_txt.hidden = true
  el_endmsg.hidden = true
}

const new_select = function () {
  show_selectors()
  clear_screen()
}

el_new.onmouseup = new_select
el_new.onclick   = new_select

el_zzback.onclick   = () => { clear_screen(); parent.zz_done()   }
el_zzignore.onclick = () => { clear_screen(); parent.zz_ignore() }

onload = function () {
  el_ok.disabled = true
  init_inputs()
  chstyle()  // to update the style, as we don't reset these
             // inputs, so they keep their values on refresh.
  decode_contact()
  ligilumi()
  el_txt_txt.spellcheck = false
}

// vim: set sw=2 ts=2 et fdm=marker colorcolumn=80:
