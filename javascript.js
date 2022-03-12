let opts = {}

function start_reciting () {
  const quizmode = el_quizmode.value
  hide_selectors(quizmode)
  el_nextword.focus()
  if (!valid_inputs(sura_bgn_val(), aaya_bgn_val(), sura_end_val(), aaya_end_val())) { return }
  const st = start_(sura_bgn_val()) + aaya_bgn_val()
  const en = start_(sura_end_val()) + aaya_end_val()
  const teacher = el_teacher_input.checked
  const qari = el_qaris.value
  opts = {...opts, st, en, qari, teacher, quizmode}
  recite(opts)
}

function restart_reciting () {
  // qari and quizmode and teacher can change from the UI.
  opts.qari = el_qaris.value
  opts.quizmode = el_quizmode.value
  opts.teacher = el_teacher_input.checked
  hide_selectors(opts.quizmode)  // handles the change of quiz mode
  recite(opts)
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
    if (!el_imla_txt.hidden) {
      el_imla_txt.style.height = el_zzback.hidden? 'calc(100vh - 12rem)' : 'calc(100vh - 15rem)'
      el_imla_txt.scroll({ top: el_imla_txt.scrollHeight })  // scroll to bottom
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

function scroll_to_top ()    { el_body.scrollTo({ top: 0 }) }
function scroll_to_bottom () { el_body.scrollTo({ top: el_body.scrollHeight }) }

function hide_el (el) { el.style.visibility = 'hidden';  el.style.opacity =   '0%' }
function show_el (el) { el.style.visibility = 'visible'; el.style.opacity = '100%' }

function sync_ui (stpair, enpair, title, preserve_url) {
  if (!preserve_url) { window.location.hash = stpair.join('/') + '-' + enpair.join('/') }
  document.querySelector('title').innerHTML = title + ' | رسايت'
  if (!el_zzignore.hidden) { parent.zz_set_title(title) }
  //
  el_sura_bgn.value = stpair[0]-1; el_aaya_bgn.value = filter_aaya_input(stpair[1])
  el_sura_end.value = enpair[0]-1; el_aaya_end.value = filter_aaya_input(enpair[1])
}

function init_audio (stpair, enpair, qari) {
  audio.init(qari)
  audio.fill(make_audio_list(stpair[0]-1, stpair[1], enpair[0]-1, enpair[1]))
}

function recite (o) {
  opts = o

  const preserve_url = !!window.location.search || !!window.location.hash

  el_zzback.style.display = o.zz? 'block' : 'none'
  el_zzback.hidden = !o.zz
  el_zzignore.hidden = !o.zz
  el_new.hidden = !!o.zz  // only hide if ignore is shown

  const stpair = idx2aya(o.st-1)
  const enpair = idx2aya(o.en-1)
  const [title, titleclass] = make_title(...stpair, ...enpair)
  el_title.innerHTML = title
  el_title.classList = titleclass
  sync_ui(stpair, enpair, title, preserve_url)
  init_audio(stpair, enpair, o.qari, preserve_url)

  if (o.zz) { parent.zz_show() }
  hide_selectors(o.quizmode)

  const start = () => { _recite(o) }
  if (quizmode === 'imla') { load_imla(start) }
  else {  /* uthmani, which is split into two parts */
    const n1 = is_in_first_half(o.st, o.en)
    const n2 = is_in_second_half(o.st, o.en)
    if (n1 && n2) { load_uthm1(() => { load_uthm2(start) }) }  // TODO: parallize
    else if (n1) { load_uthm1(start) }
    else if (n2) { load_uthm2(start) }
  }
}

function _recite (o) {

  document.addEventListener('keyup', (ev) => {
    if (ev.key === 'Escape') {
      audio.play()
      if (quizmode === 'imla') {
        // re-focus, b/c Escape unfocuses it
        el_imla_txt.focus()
      }
    }
  })

  if (quizmode === 'imla') {
    el_imla_txt.focus()
    let correct_text = imlaai_ayat(o.st, o.en)
    let pasted = false

    const get_current_aaya_index = () =>
      el_imla_txt.value.split('\n').length - 2 + (o.teacher? 1 : 0)

    const txt_changed = function () {
      audio.set_index(get_current_aaya_index())

      if (!el_endmsg.hidden) { return }

      if (pasted) {
        el_imla_txt.value = el_imla_txt.value.replace(/ \u06dd/g, '\xa0\u06dd')
        // because NBSP is copied as a normal, ASCII space
        pasted = false
      }

      if (correct_text.startsWith(imlafilter(el_imla_txt.value))) {
        el_imla_txt.classList = ''
        if (el_imla_txt.value.slice(-1) === '\n') {  // basmala, or BS+Enter to repeat the same aaya
          audio.play()
        }
      }

      else if (el_imla_txt.value.slice(-1) === '\n'
          && correct_text.startsWith(el_imla_txt.value.slice(0,-1) + '\xA0\u06dd'))
      {
        let x = el_imla_txt.value.length + 2
        while (correct_text.slice(x, x+1) !== '\n') { ++x }
        el_imla_txt.value = correct_text.slice(0, x+1)
        audio.play()
        if (el_imla_txt.value === correct_text) {
          el_imla_txt.value = el_imla_txt.value.slice(0,-1)  // remove the last newline
          show_done()
          scroll_to_bottom()
          el_imla_txt.disabled = true
          el_imla_txt.classList = 'done'
          el_new.focus()
        }
      }

      else {
        el_imla_txt.classList = 'wrong'
      }
    }

    el_imla_txt.oninput = txt_changed // https://stackoverflow.com/a/14029861
    el_imla_txt.onpaste = (e) => { pasted = true }
    el_imla_txt.focus()

  }
  else {
    el_uthm_txt.focus()
    audio.set_index(o.teacher? 0 : -1)

    let words = make_words_list(o.st, o.en)

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
      if (new_word_kind === 'a') { audio.next(); audio.play() }
      el_uthm_txt.innerHTML += txt
      if (words.length === 0) { show_done() }
      scroll_to_bottom()
    }

    const word_fwd = () => fwd('w')
    const aaya_fwd = () => fwd('a')
    const jmla_fwd = () => fwd('j')

    const word_bck = function (ev) {
      if (el_uthm_txt.innerHTML.length === 0) { return 'a' }
      if (!el_endmsg.hidden) { return 'a' }
      const last_word = el_uthm_txt.innerHTML.match(/(?:^|\t|<br>\n)([^\n\t]+(?:\t|<br>\n))$/)[1]
      words.unshift(last_word)
      el_uthm_txt.innerHTML = el_uthm_txt.innerHTML.substring(0, el_uthm_txt.innerHTML.length - last_word.length)
      if (last_word.match(/<br>\n$/)) {
        audio.back()
        if (teacher) { audio.play() }
      }
      return kind_of_portion( el_uthm_txt.innerHTML.slice(-2) )
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
      const on_input_field =  // not just ayat and suar; also buttons like #mvbtns
        ev.target.nodeName === 'INPUT' || ev.target.nodeName === 'SELECT' || ev.target.nodeName === 'BUTTON'

      if (on_input_field) { return }

      if      (kb_fwd) { if (kb_mod) { aaya_fwd() } else { word_fwd() } }
      else if (kb_bck) { if (kb_mod) { aaya_bck() } else { word_bck() } }
      else if (ev.key === '0' && !kb_mod) { jmla_fwd() }
      else if (ev.key === '1' && !kb_mod) { jmla_bck() }

    }

    // both events are the "up" variants to disable repeating (holding down
    // the key, even for a few additional milliseconds by accident), which
    // prints a lot of words
    document.onkeyup = input_trigger
    document.ondblclick = (ev) => { if (ev.target === el_uthm_txt || ev.target === Qid('body')) { word_fwd() } }
    el_nextaaya.onclick = aaya_fwd
    el_nextjmla.onclick = jmla_fwd
    el_nextword.onclick = word_fwd
    el_prevword.onclick = word_bck
    el_prevjmla.onclick = jmla_bck
    el_prevaaya.onclick = aaya_bck

  }

  if (o.teacher) { audio.play(0) }
}

el_ok.onclick  = start_reciting

el_repeat.onmouseup = restart_reciting
el_repeat.onclick   = restart_reciting

function init_inputs () {
  el_sura_bgn.value   = el_aaya_bgn.value   = el_sura_end.value   = el_aaya_end.value   = ''
  el_sura_bgn.oninput = el_aaya_bgn.oninput = el_sura_end.oninput = el_aaya_end.oninput = validate_aaya_sura_input
  el_sura_bgn.onblur  = el_aaya_bgn.onblur  = el_sura_end.onblur  = el_aaya_end.onblur  = validate_aaya_sura_input
  el_sura_bgn.onkeyup = el_aaya_bgn.onkeyup = el_sura_end.onkeyup = el_aaya_end.onkeyup = input_trigger_x
}

const hide_selectors = function (quizmode) {
  el_selectors.hidden = true
  el_header.hidden = false
  el_endmsg.hidden = true
  el_ok.hidden = true
  el_title.style.display = 'inline-block'
  if (quizmode === 'imla') {
    el_imla_txt.style.height = '95vh'
    el_imla_txt.value = ""
    el_imla_txt.disabled = false
    el_imla_txt.classList = ''
    el_imla_txt.hidden = false
    el_uthm_txt.hidden = true
    el_mvbtns.hidden = true
    Qid('end_of_header').style.color = 'transparent'  // to keep some space
    document.documentElement.style.setProperty('--sticky', '')
  }
  else {  /* uthmani */
    el_uthm_txt.hidden = false
    el_uthm_txt.innerHTML = ''
    el_mvbtns.hidden = false
    el_imla_txt.hidden = true
    Qid('end_of_header').style.color = ''
    document.documentElement.style.setProperty('--sticky', 'sticky')
  }
  scroll_to_bottom()
}

const show_selectors = function () {
  el_selectors.hidden = false
  el_header.hidden = true
  el_ok.hidden = false
  el_mvbtns.hidden = true
  el_title.style.display = 'none'
  validate_aaya_sura_input({}) /* to enable #ok for easier repeating */
}

const clear_screen = function () {
  el_uthm_txt.innerHTML = ''
  el_imla_txt.hidden = true
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
  chquizmode()
  chstyle()  // to update the style, as we don't reset these
             // inputs, so they keep their values on refresh.
  decode_contact()
  ligilumi()
  el_imla_txt.spellcheck = false
  // fix help opening
  document.querySelectorAll('details').forEach(el => {
    el.addEventListener('toggle', ev => {
      if (el.open) {
        el.scrollIntoView({behavior: "smooth", block: "nearest", inline: "nearest"})
      }
    })
  })
}

// vim: set sw=2 ts=2 et fdm=marker colorcolumn=80:
