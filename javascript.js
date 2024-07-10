let opts = {}

const fullpage = el_body.classList.contains('fullpage')
// ^ never changes because it can be set only from url params

function start_reciting () {
  if (!valid_inputs(sura_bgn_val(), aaya_bgn_val(), sura_end_val(), aaya_end_val())) { return }
  const st = sura_offset[sura_bgn_val()] + aaya_bgn_val()
  const en = sura_offset[sura_end_val()] + aaya_end_val()
  recite(st, en)
}

function restart_reciting () {
  recite(opts.st, opts.en)
}

document.body.addEventListener('click', (ev) => {
  if (ev.target.tagName === 'BUTTON') {
    ev.target.id === 'new'
      ? el_ok.focus()
      : ev.target.blur()
  }
})

el_tl.onclick = (ev) => {
  if (ev.target === el_tl) { return }  // if clicked on the transparent part of a closed legend
  if (el_tl.getAttribute('aria-expanded') === 'true') {
    el_tl.setAttribute('aria-expanded', false)
    el_tl.Qall('circle').forEach(c =>
      c.setAttribute('cx', c.getAttribute('cx') == 950 ? 105 : 35))
    el_tl.Qall('text').forEach(t => hide_el(t))
    hide_el(el_tl.Q('line'))
    el_tl.Q('rect').setAttribute('width', 140)
    setTimeout(() => el_tl.setAttribute('viewBox', '0 0 140 400'), 500)
  }
  else {
    el_tl.setAttribute('viewBox', '0 0 1000 400')
    el_tl.setAttribute('aria-expanded', true)
    el_tl.Qall('circle').forEach(c =>
      c.setAttribute('cx', c.getAttribute('cx') < 50 ? 450 : 950))
    el_tl.Qall('text').forEach(t => show_el(t))
    show_el(el_tl.Q('line'))
    el_tl.Q('rect').setAttribute('width', 1000)
  }
}

function input_trigger_x (ev) {
  // this fn is connected to onkeyup and onmouseup. it handles three "events"

  const id = ev.target.id
  const key = ev.key

  const on_ayat = id === 'aaya_bgn' || id === 'aaya_end'
  const on_suar = id === 'sura_bgn' || id === 'sura_end'

  // Enter on suar/ayat selection: set focus on the next element:
  //   sura_bgn > aaya_bgn > sura_end > aaya_end > ok
  // also, on the last element, get the next (ie first) word
  if (key === 'Enter' && (on_ayat || on_suar)) {
    (id === 'sura_bgn' ? el_aaya_bgn :
     id === 'aaya_bgn' ? el_sura_end :
     id === 'sura_end' ? el_aaya_end :
     id === 'aaya_end' ? el_ok       :
     1).focus()
    return
  }

  // Up or Down on an ayat-input, increase or decrease it
  if (on_ayat) {
    let el = Qid(id)
    if (key === 'ArrowUp')   { el.value = 1 + +defilter_aaya_input(el.value) }
    if (key === 'ArrowDown') { el.value = 1 - +defilter_aaya_input(el.value) }
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
    if (!el_imla_txt_container.hidden) {  /* imlaai mode */
      resize_imlaai_done()
      imla_scroll_to_bottom()
    }
    else {  /* uthmani mode */
      el_uthm_txt.classList.add('done')
    }
    return true
  }
  return false
}

function tab_toggled (el) {
  if (el.checked) {
    setTimeout(body_scroll_to_top, 100)
  }
}

function sync_ui (stpair, enpair, title, preserve_url) {
  if (!preserve_url) { L.hash = stpair.join('/') + '-' + enpair.join('/') }
  Q('title').innerHTML = title + ' | رسيت'
  zz_set('title', title)
  //
  el_sura_bgn.value = stpair[0]-1; el_aaya_bgn.value = filter_aaya_input(stpair[1])
  el_sura_end.value = enpair[0]-1; el_aaya_end.value = filter_aaya_input(enpair[1])
}

function init_audio (stpair, enpair, qari, qariurl) {
  audio.init(qari, qariurl)
  audio.fill(make_audio_list(stpair[0]-1, stpair[1], enpair[0]-1, enpair[1]))
}

function recite (st, en) {
  opts.st = st ? st : opts.st
  opts.en = en ? en : opts.en

  const cn = !!el_cn.value
  const zz = !!el_zz.value
  const qari = el_qaris.value
  const qariurl = el_qariurl.value
  const quizmode = el_quizmode.value
  const teacher = el_teacher_input.checked

  const preserve_url = !!L.search || !!L.hash

  hide_selectors(quizmode)

  el_zzback.style.display = zz ? 'block' : 'none'
  el_zzback.hidden = !zz
  el_zzignore.hidden = !zz
  el_new.hidden = !!zz  // only hide if ignore is shown

  const stpair = idx2aya(st-1)
  const enpair = idx2aya(en-1)
  const title = make_title(...stpair, ...enpair)
  el_title.innerHTML = title
  sync_ui(stpair, enpair, title, preserve_url)
  init_audio(stpair, enpair, qari, qariurl, preserve_url)

  if (zz) { parent.zz_show() }
  const _recite = quizmode === 'imla' ? _recite_imla : _recite_uthm
  load(quizmode, st, en, _recite)
}

document.addEventListener('keyup', (ev) => {
  if (ev.key === 'Escape') {
    audio.play()
    // if currently quizzing, in imlaai mode
    if (!el_imla_txt_container.hidden && el_endmsg.hidden) {
      // re-focus, b/c Escape unfocuses it
      el_imla_txt.focus()
    }
  }
})

function _recite_imla () {
  const st = opts.st
  const en = opts.en
  const teacher = el_teacher_input.checked

  el_imla_txt.focus()
  let correct_text = imlaai_ayat(st, en)
  let pasted = false

  const get_current_aaya_index = () =>
    el_imla_txt.value.split('\n').length - 2 + (teacher ? 1 : 0)

  const cursor_at_end = el_imla_txt.selectionStart === el_imla_txt.value.length
  // selectionStart is guaranteed to be ≤ selectionEnd

  const __correct_position_of = (str, last_char) => {
    // pre-conditions:
    // - imla_match(correct_text, str) must be true;  ie str must be correct so far
    // - str.slice(-1) === last_char;  ie last_char must be the actual last character
    // - remove_imla_additions(last_char) === last_char;  ie last_char must NOT be an addition
    let correct_end = 0
    const input_end = count_char(str, last_char)
    for (let i = 0; i < input_end; ++i) {
      correct_end = correct_text.indexOf(last_char, correct_end) + 1
    }
    return correct_end
  }

  const fix_imla_additions = (last_char) => {
    // pre-conditions: see __correct_position_of (with str=el_imla_txt.value)
    const correct_end = __correct_position_of(el_imla_txt.value, last_char)
    if (el_imla_txt.selectionStart === el_imla_txt.value.length) {
      // cursor is at the end
      el_imla_txt.value = correct_text.slice(0, correct_end)
    }
    else {
      // cursor is NOT at the end; try to maintain its position
      const before = remove_imla_additions(el_imla_txt.value.slice(0, el_imla_txt.selectionStart))
      const pos = __correct_position_of(before, before.slice(-1))
      el_imla_txt.value = correct_text.slice(0, correct_end)
      el_imla_txt.selectionStart = el_imla_txt.selectionEnd = pos+1
    }
  }

  const txt_changed = function () {

    if (!el_endmsg.hidden) { return }

    if (pasted) {
      el_imla_txt.value = el_imla_txt.value
        // restore NBSP because it's copied as a normal, ASCII space
        .replace(/ \u06dd/g, '\xa0\u06dd')
        // remove all invalid characters
        .replace(/[^ \xA0\nء-غف-\u0652٠-٩\u06DD]+/g, '')
        // remove superfluous spaces (see below)
        .replace(/ +(\n)/g, '$1')
        .replace(/(\A|\n| )[ \n]+/g, '$1')  // ⎵\n is matched before
      pasted = false
    }

    // remove superfluous spaces:
    //   the second char of: \A⎵ | \n⎵ | ⎵⎵ | \A\n | \n\n
    //   and the first of: ⎵\n
    // note: only checks against the last two chars/bytes, and only once
    const last_two = el_imla_txt.value.slice(-2)
    if (last_two === ' ' || last_two === '\n') {  // the entire input is this char
      el_imla_txt.value = ''
    }
    if (last_two === '  ' || last_two === '\n ' || last_two === '\n\n') {
      el_imla_txt.value = el_imla_txt.value.slice(0,-1)
    }
    if (last_two === ' \n') {
      el_imla_txt.value = el_imla_txt.value.slice(0,-2)+'\n'
    }

    if (!imla_match(correct_text, el_imla_txt.value)) {
      // is the only problem is typing the last character as space instead of newline or vice versa?
      const input_last_char = el_imla_txt.value.slice(-1)
      if (el_feedbackrate.value !== 'a' && (
          input_last_char === ' '  && imla_match(correct_text, el_imla_txt.value.slice(0,-1) + '\n')
       || input_last_char === '\n' && imla_match(correct_text, el_imla_txt.value.slice(0,-1) + ' ')
      )) {
        el_imla_txt_container.classList = 'spacewrong'
      }
      else {
        el_imla_txt_container.classList = 'wrong'
      }
    }
    else {
      el_imla_txt_container.classList = ''
      if (!cursor_at_end) { return }
      const last_char = el_imla_txt.value.slice(-1)
      if (last_char === '\n' || (el_feedbackrate.value !== 'a' && last_char === ' ')) {
        fix_imla_additions(last_char)
      }
      if (last_char === '\n') {
        audio.play(get_current_aaya_index())
      }
      if (el_imla_txt.value === correct_text) {
        el_imla_txt.value = el_imla_txt.value.slice(0,-1)  // remove the last newline
        show_done()
        body_scroll_to_bottom()
        el_imla_txt.disabled = true
        el_imla_txt_container.classList = 'done'
        el_new.focus()
      }
    }

    // if at the end: pad bottom (by scrolling to bottom), to handle if moved to a new line
    if (el_imla_txt.selectionStart === el_imla_txt.value.length) {
      requestAnimationFrame(imla_scroll_to_bottom)
      // I don't exactly know why a delay is needed, but it wouldn't work otherwise
    }

  }

  let bang = 0
  let since_last_bang = 0

  el_imla_txt.onkeydown = (ev) => {
    const unmodified = !ev.altKey && !ev.ctrlKey

    // cheating -- enabled by default unless disablecheat is passed as a url param
    if (unmodified && ev.key === '!' && window.allow_cheating) {
      ev.preventDefault()
      // enforce at least 0.25 sec between each keydown of bang
      // because for some reason ev.repeat always returns false in my testing.
      const now = (new Date()).getTime()
      if (now - since_last_bang < 250) { return }
      since_last_bang = now
      bang += 1
      if (bang === 10) {
        bang = 0
        // cheat one character, if all up to this point is correct.
        // if the feedback rate is not letter, imla_match can succeed while the input is wrong,
        // so fix_imla_additions would complete too many chars to match the last char and then add one;
        // e.g., recite/?txt&by=word&1/1 (the first aaya in al-Fatiha): type only ي then hold '!'.
        // also taking the last char blindly could take a tashkeel, which would cause the same issue.
        // hence we first force imla_match to act as if it's by=letter for the first issue,
        // then for the second issue we remove_imla_additions before taking the last char.
        if (imla_match(correct_text, el_imla_txt.value, imlafilter_byletter)) {
          fix_imla_additions( remove_imla_additions(el_imla_txt.value).slice(-1) )
          // add one char; then while the last copied-to-input char is an addition (tashkeel etc): add one more
          do {
            el_imla_txt.value = correct_text.slice(0, el_imla_txt.value.length+1)
          } while (remove_imla_additions(el_imla_txt.value.slice(-1)) === '')
          txt_changed()
          // scroll to bottom, to handle if the added letter caused moving to the next line
          imla_scroll_to_bottom()
          return
        }
      }
    }
    else {
      // any key resets the counters; even a lone Shift.
      bang = 0
      since_last_bang = 0
    }

    // filtering & emulation
    if (unmodified && ev.key.length === 1) {
      ev.preventDefault()
      const k = window.emulate
        && mappings[window.emulate]
        && mappings[window.emulate][ev.code]
         ? mappings[window.emulate][ev.code][+ev.shiftKey]
         : ev.key
      if (k.match(/^[ \nء-غف-\u0652]$|^ل[اأإآ]$/)) {  // the lam-alefs for emulated IBM kb
        insert_in_field(el_imla_txt, k)
        txt_changed()
      }
    }

  }

  el_imla_txt.oninput = txt_changed  // https://stackoverflow.com/a/14029861
  el_imla_txt.onpaste = (e) => { pasted = true }

  // these are set in Uthmani; need to override if used Uthmani before Imlaai without reloading the page
  document.onkeyup = null
  document.ondblclick = null

  if (teacher) { audio.play(0) }
}

function _recite_uthm () {
  const st = opts.st
  const en = opts.en
  const cn = !!el_cn.value
  const teacher = el_teacher_input.checked

  el_uthm_txt.classList.remove('done')
  el_uthm_txt.focus()
  audio.set_index(teacher ? 0 : -1)

  el_tafsirhint.style.marginTop = '2em'  // shows after end of recitation

  if (el_tl_input.checked) { el_tl.style.display = '' }

  let words = make_words_list(st, en, cn)

  const fwd = function (kind) {
    if (words.length === 0) { return }
    const isnt_the_kind =
      kind === 'a' ? (k) => k !== 'a' :
      kind === 'j' ? (k) => k !== 'a' && k !== 'j' :
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
    body_scroll_to_bottom()
  }

  const word_fwd = () => fwd('')
  const aaya_fwd = () => fwd('a')
  const jmla_fwd = () => fwd('j')

  const bck = function (kind) {
    let uthm = el_uthm_txt.innerHTML
    if (uthm.length === 0 || !el_endmsg.hidden) { return }
    while (uthm.length > 0) {
      const last_word = uthm.match(/(?:^|\t|\n)([^\n\t]+(?:\t|\n))$/)[1]
      words.unshift(last_word)
      uthm = uthm.substring(0, uthm.length - last_word.length)
      if (last_word.match(/\n$/)) {
        audio.back()
        if (teacher) { audio.play() }
      }
      const new_kind = kind_of_portion(uthm.slice(-2))
      if (kind === new_kind || (kind === 'j' && new_kind === 'a')) { break }
    }
    el_uthm_txt.innerHTML = uthm
  }

  const word_bck = () => bck('')
  const aaya_bck = () => bck('a')
  const jmla_bck = () => bck('j')

  const input_trigger = function (ev) {

    const name = ev.target.nodeName
    const key = ev.key

    const kb_mod = ev.shiftKey || ev.ctrlKey || ev.altKey
    const kb_fwd = key === ' ' || key === 'Enter' || key === 'ArrowLeft'
    const kb_bck = key === 'Backspace' || key === 'ArrowRight'
    const on_input_field =  // not just ayat and suar; also buttons like #mvbtns
      name === 'INPUT' || name === 'SELECT' || name === 'BUTTON'

    if (on_input_field) { return }

    if      (kb_fwd) { if (kb_mod) { aaya_fwd() } else { word_fwd() } }
    else if (kb_bck) { if (kb_mod) { aaya_bck() } else { word_bck() } }
    else if ((key === '0' || key === '[') && !kb_mod) { jmla_fwd() }
    else if ((key === '1' || key === ']') && !kb_mod) { jmla_bck() }

  }

  // both events are the "up" variants to disable repeating (holding down
  // the key, even for a few additional milliseconds by accident), which
  // prints a lot of words
  document.onkeyup = input_trigger
  document.ondblclick = (ev) => { if (ev.target === el_uthm_txt || ev.target === el_body) { word_fwd() } }
  el_nextaaya.onclick = aaya_fwd
  el_nextjmla.onclick = jmla_fwd
  el_nextword.onclick = word_fwd
  el_prevword.onclick = word_bck
  el_prevjmla.onclick = jmla_bck
  el_prevaaya.onclick = aaya_bck

  if (teacher) { audio.play(0) }
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
  el_tafsirhint.hidden = true
  const d = document.documentElement
  if (quizmode === 'imla') {
    el_imla_txt_container.style.height = fullpage ? '100vh' : '95vh'
    el_imla_txt.value = ""
    el_imla_txt.disabled = false
    el_imla_txt_container.classList = ''
    el_imla_txt_container.hidden = false
    el_uthm_txt.hidden = true
    el_mvbtns.hidden = true
    el_end_of_header.style.color = 'transparent'  // to keep some space
    d.style.setProperty('--sticky', '')
    el_imla_txt.focus()
  }
  else {  /* uthmani */
    el_uthm_txt.hidden = false
    el_uthm_txt.innerHTML = ''
    el_mvbtns.hidden = false
    el_imla_txt_container.hidden = true
    el_end_of_header.style.color = ''
    d.style.setProperty('--sticky', 'sticky')
    // el_nextword.focus()
  }
  body_scroll_to_bottom()
}

const show_selectors = function () {
  el_selectors.hidden = false
  el_header.hidden = true
  el_ok.hidden = false
  el_mvbtns.hidden = true
  el_title.style.display = 'none'
  el_tl.style.display = 'none'  // tajweed legend
  validate_aaya_sura_input({}) /* to enable #ok for easier repeating */
  el_tafsirhint.hidden = el_quizmode.value !== 'uthm'  // show if uthmani
}

const clear_screen = function () {
  // if was in uthmani mode
  el_uthm_txt.hidden = true
  document.onkeyup = null
  document.ondblclick = null
  el_tafsirhint.style.marginTop = '4em'  // shows on an empty page
  // if was in imlaai mode
  el_imla_txt_container.hidden = true
  // if either mode
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
  // To update the styles, as we don't reset these
  // inputs, so they keep their values on refresh:
  Qall('input, select').forEach(e => e.onchange && e.onchange())
  decode_contact()
  versligilumi()
  el_tl.onclick({})  // close
  el_tl.style.display = 'none'
  el_imla_txt.spellcheck = false
  // fix help opening
  Qall('details').forEach(el => {
    el.addEventListener('toggle', ev => {
      if (el.open) {
        if (window.prefers_reduced_motion)
          el.scrollIntoView({ block: "nearest", inline: "nearest" })
        else
          el.scrollIntoView({ behavior: 'smooth', block: "nearest", inline: "nearest" })
      }
    })
  })
}

el_imla_txt.onfocus = () => el_imla_txt.scrollIntoView(window.scroll_behavior)

function resize_imlaai_done () {
  // getComputedStyle not getBoundingClientRect to get the content (selectors) without padding (tabs)
  const g = getComputedStyle
  const f = parseFloat
  const sel = f(g(el_selectors).height)
            + f(g(el_selectors.Q('hr')).marginBottom)
  const before = isNaN(sel) /* zz-mode */
               ? f(g(el_header).height)
               : sel
  const _m = g(el_endmsg)
  const after = f(_m.height) + f(_m.marginTop) + f(_m.marginBottom)
  const one_em = f(_m.marginTop)
  const v = visualViewport
  const all = v ? v.height : document.body.clientHeight
  el_imla_txt_container.style.height = (all - before - after - 0.1*one_em) + 'px'
}

if (window.visualViewport) {
  window.visualViewport.addEventListener('resize', (ev) => {
    if (!el_imla_txt_container.hidden) {  // if imlaai mode
      if (el_endmsg.hidden) {  // if currently quizzing
        el_imla_txt_container.style.height =
          fullpage
            ? ev.target.height + 'px'
            : Math.trunc(ev.target.height * 0.95) + 'px'  // emulate '95vh'
        el_imla_txt.scrollIntoView()
      }
      else {
        resize_imlaai_done()
      }
    }
  })
}
