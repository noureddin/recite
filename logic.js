let opts = {}

// TODO: notitle (dont_show_title): should hide suar names in reciting, if the first aaya of a recitation is the first aaya of the sura?

const fullpage = el_body.classList.contains('fullpage')
// ^ never changes because it can be set only from url params

const indicate_invalid_inputs = (() => {
  // you should never be able to trigger this; the validate_*_input() functions
  // make sure you never have invalid inputs. but this is here if something slips.
  const add = () => el_tabframe.classList.add('invalid')
  const del = () => el_tabframe.classList.remove('invalid')
  const has = () => el_tabframe.classList.contains('invalid')
  let timeout_id = null
  //
  const indicate_invalid = () => { add(); timeout_id = setTimeout(del, 3000) }
  // remove the class after the animation duration
  //
  return () => {
    if (has()) {
      del()
      clearTimeout(timeout_id)
      timeout_id = null
      requestAnimationFrame(() => requestAnimationFrame(() => requestAnimationFrame(indicate_invalid)))
      // two rAFs are required for reliable removal & re-adding of the class; tested on FF & Blink; a third is added to be safe.
    }
    else {
      indicate_invalid()
    }
  }
})()

function read_input_from_ui () {
  if (el_tabchoice_ayat.checked) {
    if (!valid_ayat_inputs(sura_bgn_val(), aaya_bgn_val(), sura_end_val(), aaya_end_val())) {
      indicate_invalid_inputs()
      return []
    }
    else {
      const st = sura_offset[sura_bgn_val()] + aaya_bgn_val()
      const en = sura_offset[sura_end_val()] + aaya_end_val()
      return [st, en]
    }
  }
  else {  // pages
    const stpage = el_page_bgn.value
    const enpage = el_page_end.value
    if (!valid_pages_inputs(stpage, enpage)) {
      indicate_invalid_inputs()
      return []
    }
    else {
      const st = page_offset[+stpage - 1] + 1
      const en = page_offset[+enpage]
      return [st, en]
    }
  }
}

function show_first () {
  const [st, en] = read_input_from_ui()
  if (st != null) { preview(st, en) }
}

function start_reciting () {
  const [st, en] = read_input_from_ui()
  if (st != null) { recite(st, en) }
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
  if (el_tl.getAttribute('aria-expanded') === 'true') {
    el_tl.setAttribute('aria-expanded', false)
    el_tl.Qall('circle').forEach(c =>
      c.setAttribute('cx', c.getAttribute('cx') == 875 ? 125 : 45))
    el_tl.Qall('text').forEach(t => hide_el(t))
    hide_el(el_tl.Q('line'))
    el_tl.Q('rect').setAttribute('width', 155)
    setTimeout(() => el_tl.setAttribute('viewBox', '0 0 155 400'), 500)
  }
  else {
    el_tl.setAttribute('viewBox', '0 0 925 400')
    el_tl.setAttribute('aria-expanded', true)
    el_tl.Qall('circle').forEach(c =>
      c.setAttribute('cx', c.getAttribute('cx') < 50 ? 400 : 875))
    el_tl.Qall('text').forEach(t => show_el(t))
    show_el(el_tl.Q('line'))
    el_tl.Q('rect').setAttribute('width', 925)
  }
}

function show_done () {
  removeEventListener('beforeunload', before_unload)
  if (el_endmsg.hidden) {
    set_title('تم ' + opts.title)
    el_endmsg.hidden = false
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      confetti.start(1200, 50, 150)
    }
    if (el_zzback.style.display === 'none') {  /* not zz-mode */
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
    //
    return true
  }
  return false
}

function tab_toggled (el) {
  if (el.checked) {
    setTimeout(body_scroll_to_top, 100)
  }
}

function set_title (title) {
  let htitle = title.replace(/^تم /, '')
  let endtitle = title.replace(/^تم /, /* "[Well Done!] You have completed..." */ 'أتممت ')
  //
  if (title) {
    if (window.get_connection && !title.match(/كامل[ةت]/) && !title.match(/السور من/) && !title.match(/الأخيرة/)) {
      htitle += ' مع الربط بما يليها'
      endtitle += ' مع\xa0الربط\xa0بما\xa0يليها'  // NBSP
    }
    //
    el_title.innerHTML = htitle
    el_endtitle.innerHTML = endtitle
    el_title.style.display = 'block'
  }
  else {
    el_title.innerHTML = ''
    el_endtitle.innerHTML = ''
    el_title.style.display = 'none'
  }
  document.title = (htitle ? (htitle + ' | ') : '' ) + 'رسيت'
  zz_set('title', htitle)
}

function sync_ui (stpair, enpair) {
  el_sura_bgn.value = stpair[0]-1
  el_sura_end.value = enpair[0]-1
  set_aayaat(el_aaya_bgn, sura_bgn_length(), stpair[1])
  set_aayaat(el_aaya_end, sura_end_length(), enpair[1])
}

function init_audio (stpair, enpair, qari, qariurl) {
  audio.init(qari, qariurl)
  audio.fill(make_audio_list(stpair[0]-1, stpair[1], enpair[0]-1, enpair[1]))
}

function preview (st, en, from_url) {
  opts.st = st ? st : opts.st
  opts.en = en ? en : opts.en

  hide_selectors('preview')

  const stpair = idx2aya(st-1)
  const enpair = idx2aya(en-1)

  // don't update url params if launched directly from the url
  if (!from_url) { L.hash = stpair.join('/') + '-' + enpair.join('/') + '&p' }

  const title = make_title(...stpair, ...enpair).replace(/تسميع/g, 'عرض')
  set_title(title)  // TODO: should 'notitle' affect preview?
  sync_ui(stpair, enpair)

  el_tafsirhint.className = ''
  el_prlinehint.className = ''
  el_uthm_txt.style.textAlign = 'center'
  el_uthm_txt.append(spinner)

  // these are set in Uthmani; need to override if used Uthmani before Preview without reloading the page
  document.onkeyup = null
  document.ondblclick = null

  load('u', () => {
    const st = opts.st
    const en = opts.en
    el_uthm_txt.style.textAlign = ''
    el_uthm_txt.innerHTML = ''
    el_uthm_txt.classList.remove('done')
    show_or_hide_tajweedlegend()
    el_uthm_txt.innerHTML = make_words_list(st, en, window.get_connection).join('')
    // console.log(ascii_debug_uthm(el_uthm_txt.innerHTML))
    onresize()  // update uthmani font-size if lines=pr
  })
}

function testlinelengths () {

  hide_selectors('preview')
  requestAnimationFrame(() => {
    el_tafsirhint.hidden = true
    el_prlinehint.hidden = true
    el_tl.style.display = 'none'  // hide tajweed legend
  })

  set_title('اختبار أطوال الأسطر')
  el_uthm_txt.style.textAlign = 'center'
  el_uthm_txt.append(spinner)

  // these are set in Uthmani; need to override if used Uthmani before Preview without reloading the page
  document.onkeyup = null
  document.ondblclick = null

  load('u', () => {
    el_uthm_txt.style.textAlign = ''
    el_uthm_txt.innerHTML = ''
    el_uthm_txt.classList.remove('done')
    el_uthm_txt.innerHTML = make_words_list(0, 6235).join('')
    el_uthm_txt.classList.add('anywidth')  // remove width restriction on the lines; to see the real width of short lines
    el_uthm_txt.classList.add('pr')  // force printed-like lines, without affect user preference
    // almost all user choices & url params are ignored or irrelavant;
    // the only one that affects the results is the experimental gaps.
    el_uthm_txt.innerHTML = make_words_list(1, 6236).join('')
    const lines = Array.from(el_uthm_txt.querySelectorAll('pr-line'))
      .filter(ln => ln.className === '')  // remove .short & .realy-short & .suraname lines
    if (lines.length === 0) { return }
    const widths = lines.map((ln,i) => [ln.scrollWidth, i]).sort((a,b) => b[0] - a[0])  // calculate displayed width and sort
    console.log(lines[0].clientWidth)
    widths.slice(0,20).forEach(([wid,idx],n) =>
      console.log((n+1+'.').padStart(3, ' '), wid,
        lines[idx].innerHTML.replace(/<[^<>]*>/g, '').replace(/[\t\n]+/g, ' ').replace(/&nbsp;/g, '\xa0'))
    )
    el_uthm_txt.innerHTML = ''
    el_uthm_txt.append(...widths.slice(0,20).map(([wid,idx]) => lines[idx]))
    el_uthm_txt.append(...widths.slice(widths.length-20).map(([wid,idx]) => lines[idx]))
    // see `longestline_txt` near the end of this file, in the definition of onresize() and before it.
  })
}

function recite (st, en, from_url) {
  opts.st = st ? st : opts.st
  opts.en = en ? en : opts.en

  const qari = el_qaris.value
  const qariurl = el_qariurl.value
  const quizmode = el_quizmode.value
  const teacher = el_teacher.checked

  const qz = quizmode.slice(0,1) /* 'u' or 'i' */

  hide_selectors(quizmode)

  const stpair = idx2aya(st-1)
  const enpair = idx2aya(en-1)

  // don't update url params if launched directly from the url
  if (!from_url) { L.hash = stpair.join('/') + '-' + enpair.join('/') }

  opts.title = make_title(...stpair, ...enpair)
  set_title(window.dont_show_title ? '' : opts.title)
  sync_ui(stpair, enpair)
  init_audio(stpair, enpair, qari, qariurl)

  if (window.is_embedded) { window.random_recitation ? parent.rr_show() : parent.zz_show() }

  el_mvbtns.Qall('button').forEach(e => e.disabled = true)
  el_uthm_txt.style.textAlign = 'center'
  el_uthm_txt.append(spinner)

  const _recite = quizmode === 'imla' ? _recite_imla : _recite_uthm
  load(qz, _recite)
}

document.addEventListener('mousemove', (ev) => {
  document.body.classList.remove('nocursor')
})

document.addEventListener('keyup', (ev) => {
  document.body.classList.add('nocursor')
})

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

// https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event
const before_unload = (ev) => { ev.preventDefault(); ev.returnValue = '' }

function _recite_imla () {
  addEventListener('beforeunload', before_unload)
  const st = opts.st
  const en = opts.en
  const teacher = el_teacher.checked

  el_imla_txt.focus()
  const correct_text = imlaai_ayat(st, en, window.get_connection)
  let pasted = false

  const append_annotation_if_exists = (offset, prefix, onlyreturn) => {
    if (isNaN(+offset)) { console.warn('bad offset in append_annotation_if_exists(): '+offset); return "" }
    // console.log('aaie', offset, prefix)
    const slice = correct_text.slice(offset, offset+20)
    // console.log(slice)
    if (slice.startsWith('('+prefix)) {
      const annot = slice.replace(/\)\n.*/s, ')\n')
      if (onlyreturn) { return annot }
      el_imla_txt.value += annot
    }
    return ""  // for using onlyreturn
  }

  append_annotation_if_exists(0, 'سورة')

  // console.log(correct_text)

  const get_current_aaya_index = () =>
    el_imla_txt.value.replace(/^\(.*?\)$\n/mg, '').split('\n').length - 2 + (teacher ? 1 : 0)

  const cursor_at_end = () => el_imla_txt.selectionStart === el_imla_txt.value.length
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
    if (last_char === '') {  // empty
      // append_annotation_if_exists(0, 'سورة')
      return
    }
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
      let v = el_imla_txt.value
        // restore NBSP, because it's copied as a normal, ASCII space
        .replace(/ \u06dd/g, '\xa0\u06dd')
        // remove all invalid characters
        .replace(/[^ \xA0\nء-غف-\u0652٠-٩\u06DD()]+/g, '')  // keep () for annotations to be removed
        // remove annotations
        .replace(/\(.*?\)/g, '')
        .replace(/[()]/g, '')
        // removes tashkeel and ayat numbers (aka. remove_imla_additions())
        .replace(/\xA0\u06DD[٠-٩]+/g, '').replace(/[\u064B-\u0652\xA0\u06DD٠-٩]+/g, '')
        // remove superfluous spaces (see below)
        .replace(/ +(\n)/g, '$1')
        .replace(/(^|\n| )[ \n]+/g, '$1')  // ⎵\n is matched before
      // restore proper annotations
      const pastedlines = v.split('\n')
      const correctlines = correct_text.split('\n')
      const correctplainlines = remove_imla_additions(correct_text).split('\n')
      // console.log(pastedlines)
      v = ''
      for (let i = 0, j = 0, annot = ''; i < pastedlines.length; ++i) {
        if (pastedlines[i] === correctplainlines[i]) {
          annot = append_annotation_if_exists(v.length, 'سورة', true)
          if (annot.length) { v += annot; ++j }
          // console.log(pastedlines[i], '\n', correctlines[j])
          v += correctlines[j] + '\n'; ++j
          annot = append_annotation_if_exists(v.length, 'صفحة', true)
          if (annot.length) { v += annot; ++j }
        }
        else {
          v += pastedlines.slice(i).join('\n')
          break
        }
      }
      el_imla_txt.value = v
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

    while (el_imla_txt.value.slice(-1) === ')') {
      el_imla_txt.value = el_imla_txt.value.replace(/(?:^|\n).*$/, '')
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
      if (!cursor_at_end()) { return }
      const last_char = el_imla_txt.value.slice(-1)
      if (last_char === '\n' || (el_feedbackrate.value !== 'a' && last_char === ' ')) {
        fix_imla_additions(last_char)
      }
      if (last_char === '\n' || last_char === '') {
        // console.log(el_imla_txt.value.length)
        audio.play(get_current_aaya_index())
        append_annotation_if_exists(el_imla_txt.value.length, 'صفحة')
        append_annotation_if_exists(el_imla_txt.value.length, 'سورة')
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


  el_imla_txt.onkeydown = (ev) => {
    const unmodified = !ev.altKey && !ev.ctrlKey

    // cheating -- enabled by default unless disablecheat is passed as a url param
    // - the '!' key: one time to add the next letter
    // - the '#' key: one time to add the next word (or complete the current one)
    if (unmodified && ev.key === '#' && window.allow_cheating) {
      ev.preventDefault()
      // press '#' once to show exactly one word, or complete the current word (including following space or newline)
      // see the long multi-line comment below in the bang branch
      if (imla_match(correct_text, el_imla_txt.value, imlafilter_byletter)) {
        fix_imla_additions( remove_imla_additions(el_imla_txt.value).slice(-1) )
        // add one char; then while the last copied-to-input char not a space or newline: add one more
        do {
          el_imla_txt.value = correct_text.slice(0, el_imla_txt.value.length+1)
        } while (el_imla_txt.value.slice(-1).match(/[ \n]/) == null)
        txt_changed()
        // scroll to bottom, to handle if the added letters caused moving to the next line
        imla_scroll_to_bottom()
        return
      }
    }
    else if (unmodified && ev.key === '!' && window.allow_cheating) {
      ev.preventDefault()
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
    else {
      // any key resets the counters; even a lone Shift.
      bang = 0
      commat = 0
      since_last_bang = 0
      since_last_commat = 0
    }

    // filtering & emulation
    if (unmodified && ev.key.length === 1) {
      ev.preventDefault()
      const k = intended_key(ev)
      if (k != null) {
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
  const teacher = el_teacher.checked

  el_mvbtns.Qall('button').forEach(e => e.disabled = false)
  el_uthm_txt.style.textAlign = ''
  el_uthm_txt.innerHTML = ''
  el_uthm_txt.classList.remove('done')
  el_uthm_txt.focus()
  audio.set_index(teacher ? 0 : -1)

  el_tafsirhint.className = ''
  el_prlinehint.className = ''

  onresize()  // update uthmani font-size if lines=pr

  let words = make_words_list(st, en, window.get_connection)

  let utxt = ''
  const openphantom  = '<span class="phantom">'
  const closephantom = '</span>'
  const nextphantom = () => {
      let phantom = ''
      for (let i = 0; i < words.length; ++i) {
        let w = words[i]
        phantom += w
        if (w.match(/<\/pr-line>/)) { break }
      }
      return openphantom + phantom
          .replace(/<\/pr-line>/g, closephantom+'$&')
          .replace(/<pr-line[^<>]*>/g, '$&'+openphantom)
  }

  const fwd = function (kind) {
    if (words.length === 0) { return }
    const isnt_the_kind =
      kind === 'a' ? (k) => k !== 'a' :
      kind === 'j' ? (k) => k !== 'a' && k !== 'j' :
                     (k) => false
    let new_word_kind, txt = ''
    while (words.length) {
      let new_word = words.shift()
      txt += new_word
      new_word_kind = kind_of_portion( new_word.replace(/<\/(?:pr-line|span)[^<>]*>/g,'').slice(-2) )
      // console.log( new_word.replace(/<\/pr-line[^<>]*>/g,'').slice(-2).replace('\n', '\\n') )
      if (!isnt_the_kind(new_word_kind)) { break }
    }
    if (new_word_kind === 'a') { audio.next(); audio.play() }  // if shown the last word of an aaya

    utxt += txt

    // console.log(debug_uthm(txt))

    el_uthm_txt.innerHTML = utxt + nextphantom()  // the browser auto-closes <pr-line> in utxt

    if (words.length === 0) { show_done() }
    body_scroll_to_bottom()
  }

  const word_fwd = () => fwd('')
  const aaya_fwd = () => fwd('a')
  const jmla_fwd = () => fwd('j')

  if (window.show_words) { for (let i = 0; i < window.show_words; ++i) { word_fwd() } }

  const bck = function (kind) {
    if (utxt.length === 0 || !el_endmsg.hidden) { return }
    const isnt_the_kind =
      kind === 'a' ? (k) => k !== 'a' :
      kind === 'j' ? (k) => k !== 'a' && k !== 'j' :
                     (k) => false
    while (utxt.length > 0) {
      const old_word = utxt.match(/(?:^|\t|\n)([^\n\t]+(?:\t|\n|\t<\/pr-line>))$/)[1]
      words.unshift(old_word)
      utxt = utxt.substring(0, utxt.length - old_word.length)
      const old_word_kind = kind_of_portion( utxt.slice(-50).replace(/<\/pr-line[^<>]*>/g,'').slice(-2) )
      if (old_word_kind === 'a') {  // if shown the first word of an aaya
        if (teacher) { audio.prev(); audio.play() }
        else         { audio.play(); audio.prev() }
        // TODO: back in teacher should play the current aaya when you hide the first word of the current aaya?
      }
      if (!isnt_the_kind(old_word_kind)) { break }
    }
    el_uthm_txt.innerHTML = utxt + nextphantom()
    body_scroll_to_bottom()
  }

  // TODO: changing teacher should not need restarting the quiz

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

el_ok.onclick = start_reciting
el_show.onclick = show_first
el_reshow.onclick = show_first

el_repeat.onclick = restart_reciting

function init_inputs () {
  // suar
  const sura_options = sura_name.map((t, i) => `<option value="${i}">${t}</option>`).join('')
  el_sura_bgn.innerHTML = el_sura_end.innerHTML = sura_options
  el_sura_sx.innerHTML = '<option value="">كل السور</option>' + sura_options
  // aayaat
  el_aaya_bgn.innerHTML = el_aaya_end.innerHTML = make_aayaat(sura_length[0])
  el_aaya_end.value   = sura_length[0]
  el_aaya_bgn.value   = 1
  el_sura_bgn.value   = el_sura_end.value = 0  // 0 = al-faatiha
  // pages
  el_page_bgn.onchange = el_page_end.onchange = validate_pages_input
  el_page_bgn.onblue   = el_page_end.onblue   = validate_pages_input
  // suar/aayaat essential interactivity
  el_sura_bgn.onchange = el_aaya_bgn.onchange = el_sura_end.onchange = el_aaya_end.onchange = validate_aaya_sura_input
  el_sura_bgn.onkeyup  = el_aaya_bgn.onkeyup  = el_sura_end.onkeyup  = el_aaya_end.onkeyup  = (ev) => {
    if (ev.key !== 'Enter') { return }
    // Enter on suar/ayat selectors: set focus on the next selector (then submit):
    //   sura_bgn > aaya_bgn > sura_end > aaya_end > ok
    if (ev.target.id === 'sura_bgn') { el_aaya_bgn .focus() } else
    if (ev.target.id === 'aaya_bgn') { el_sura_end .focus() } else
    if (ev.target.id === 'sura_end') { el_aaya_end .focus() } else
    if (ev.target.id === 'aaya_end') { el_ok       .focus() }
  }
  // support keyboard searching the aayaat fields with ASCII numerals
  let k = '', t = 0
  el_aaya_bgn.onkeydown = el_aaya_end.onkeydown = (ev) => {
    if (ev.key.match(/[0-9]/)) {
      const now = (new Date).getTime()
      now - t < 500
        ? (k += ev.key, t = now)
        : (k  = ev.key, t = now)
      const len = +ev.target.lastChild.value
      if (k >= 1 && k <= len) {
        ev.target.value = k
      }
      else if (ev.key >= 1 && ev.key <= len) {
        ev.target.value = k = ev.key
        t = now
      }
    }
  }
  // searching
  Qall('.ss, .ps').forEach(sel => { sel.querySelector('button.search').onclick = () => show_search(sel) })
}

const hide_selectors = function (quizmode) {  // quizmode must be 'preview', 'imla', 'uthm'
  el_selectors.hidden = true
  el_header.hidden = false
  el_endmsg.hidden = true
  el_title.style.display = 'inline-block'
  if (window.is_embedded) {
    el_zzback.style.display = 'block'
    el_zzignore.style.display = ''
    el_new.style.display = 'none'  // only hide if ignore is shown
    if (window.random_recitation) {
      el_zzback.innerHTML = 'جديد'
      el_zzignore.innerHTML = 'خروج'
    }
  }
  else {
    el_zzback.style.display = 'none'
    el_zzignore.style.display = 'none'
    el_new.style.display = ''  // only hide if ignore is shown
  }
  const d = document.documentElement
  if (quizmode === 'preview') {  // 2 buttons only
    el_repeat.innerHTML = 'ابدأ\nالاختبار'
    el_repeat.title = 'ابدأ في تسميع الآيات.'
    el_reshow.style.display = 'none'
    el_hb.classList.remove('b3')
    //
    el_uthm_txt.classList.add('preview')
    el_uthm_txt.hidden = false
    el_uthm_txt.innerHTML = ''
    el_mvbtns.hidden = true
    el_imla_txt_container.hidden = true
    el_end_of_header.style.color = ''
    d.style.setProperty('--sticky', 'sticky')
  }
  else {  // 3 buttons
    el_repeat.innerText = 'إعادة'
    el_repeat.title = 'اضغط لإعادة هذا الاختبار من البداية.'
    if (el_show.style.display !== 'none') {  // if preview is not disabled
      el_reshow.style.display = ''
      el_hb.classList.add('b3')
    }
    else {  // preview is disabled
      el_reshow.style.display = 'none'
    }
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
      el_uthm_txt.classList.remove('preview')
      el_uthm_txt.hidden = false
      el_uthm_txt.innerHTML = ''
      el_mvbtns.hidden = false
      el_imla_txt_container.hidden = true
      el_end_of_header.style.color = ''
      d.style.setProperty('--sticky', 'sticky')
      // el_nextword.focus()
    }
  }
  show_or_hide_tajweedlegend()
  show_or_hide_uthmani_hints()
  body_scroll_to_bottom()
}

const show_selectors = function () {
  el_selectors.hidden = false
  el_header.hidden = true
  el_mvbtns.hidden = true
  el_title.style.display = 'none'
  show_or_hide_uthmani_hints()
}

const clear_screen = function () {
  // if was in uthmani mode
  el_uthm_txt.hidden = true
  document.onkeyup = null
  document.ondblclick = null
  el_tafsirhint.className = 'f'  // on the Front (empty) page
  el_prlinehint.className = 'f'  // on the Front (empty) page
  // if was in imlaai mode
  el_imla_txt_container.hidden = true
  // if either mode
  el_endmsg.hidden = true
}

const new_select = function () {
  const has_no_progress =  // now only affects Imlaai; Uthmani quizes are allowed to be lost, for now.
    // done, in whatever mode
    !el_endmsg.hidden ||
    // Imlaai, with no content
    !el_imla_txt_container.hidden && el_imla_txt.value === '' ||
    // preview, or an Uthmani quiz
    !el_uthm_txt.hidden
    // // preview
    // !el_uthm_txt.hidden && el_repeat.innerText.startsWith('ابدأ') ||
    // // uthmani, with no content
    // !el_uthm_txt.hidden && el_uthm_txt.innerHTML === ''
  if (has_no_progress || confirm('هل تريد حقا بدء اختبار جديد وترك هذا؟')) {
    removeEventListener('beforeunload', before_unload)
    L.hash = ''
    el_tl.style.display = 'none'  // tajweed legend
    // TODO: ^ why not show_or_hide_tajweedlegend() ?
    show_selectors()
    clear_screen()
  }
}

const leave_quiz = function () {
  const has_no_progress =  // now only affects Imlaai; Uthmani quizes are allowed to be lost, for now.
    // done, in whatever mode
    !el_endmsg.hidden ||
    // Imlaai, with no content
    !el_imla_txt_container.hidden && el_imla_txt.value === '' ||
    // preview, or an Uthmani quiz
    !el_uthm_txt.hidden
    // // preview
    // !el_uthm_txt.hidden && el_repeat.innerText.startsWith('ابدأ') ||
    // // uthmani, with no content
    // !el_uthm_txt.hidden && el_uthm_txt.innerHTML === ''
  if (has_no_progress || confirm('هل تريد حقا بدء اختبار جديد وترك هذا؟')) {
    removeEventListener('beforeunload', before_unload)
    L.hash = ''
    clear_screen()
    return true
  }
  return false
}

el_new.onclick = new_select

el_zzback.onclick   = () => { if (leave_quiz()) { window.random_recitation ? parent.rr_new()    : parent.zz_done()   } }
el_zzignore.onclick = () => { if (leave_quiz()) { window.random_recitation ? parent.rr_return() : parent.zz_ignore() } }

onload = function () {
  init_inputs()
  // To update the styles, as we don't reset these
  // inputs, so they keep their values on refresh:
  Qall('input, select').forEach(e => e.onchange && e.onchange({ target: e }))
  decode_contact()
  parse_ayaurl()
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

// const longestline_txt = 'یُرِیدُ ٱلۡإِنسَـٰنُ لِیَفۡجُرَ أَمَامَهُۥ ۝٥ یَسۡءَلُ أَیَّانَ یَوۡمُ ٱلۡقِیَـٰمَةِ ۝٦ فَإِذَا بَرِقَ ٱلۡبَصَرُ'
// const longestline_txt = 'إِلَىٰ رَبِّهَا نَاظِرَةࣱ ۝٢٣ وَوُجُوهࣱ یَوۡمَئِذِۭ بَاسِرَةࣱ ۝٢٤ تَظُنُّ أَن یُفۡعَلَ بِهَا فَاقِرَةࣱ ۝٢٥'
const longestline_txt = 'وَٱلۡأَرۡضِ ذَاتِ ٱلصَّدۡعِ ۝١٢ إِنَّهُۥ لَقَوۡلࣱ فَصۡلࣱ ۝١٣ وَمَا هُوَ بِٱلۡهَزۡلِ ۝١٤ إِنَّهُمۡ'
// const longestline_txt = 'إِذۡ نَادَىٰهُ رَبُّهُۥ بِٱلۡوَادِ ٱلۡمُقَدَّسِ طُوًى ۝١٦ ٱذۡهَبۡ إِلَىٰ فِرۡعَوۡنَ إِنَّهُۥ طَغَىٰ ۝١٧'
// We use this line in onresize() to calibrate the font size. But we calibrate for one among
// the 20 widest lines, but not the first to not have too much space in most lines.

// const longestline_gaps_txt = 'یَوۡمَ تُبۡلَى ٱلسَّرَاۤئِرُ ۝٩ فَمَا لَهُۥ مِن قُوَّةࣲ وَلَا نَاصِرࣲ ۝١٠ وَٱلسَّمَاۤءِ ذَاتِ ٱلرَّجۡعِ ۝١١'
const longestline_gaps_txt = 'فَلَاۤ أُقۡسِمُ بِرَبِّ ٱلۡمَشَـٰرِقِ وَٱلۡمَغَـٰرِبِ إِنَّا لَقَـٰدِرُونَ ۝٤٠ عَلَىٰۤ أَن نُّبَدِّلَ خَیۡرࣰا مِّنۡهُمۡ'
// But with the experimental gaps, more lines are longer than the longest line without gaps.

const el_longest = document.createElement('pr-line')
el_longest.innerText = window.uthmani_gaps ? longestline_gaps_txt : longestline_txt
el_longest.style.visibility = 'hidden'

let i_resize
onresize = () => {
  if (i_resize) { clearTimeout(i_resize); i_resize = null }
  if (el_lines_input.value !== 'pr' || el_uthm_txt.hidden) {
    el_uthm_txt.style.setProperty('--size', '1.5rem')
    return
  }
  i_resize = setTimeout(() => {
    i_resize = null
    //
    el_longest.style.fontSize = '1.5rem'
    el_uthm_txt.appendChild(el_longest)
    const fsz = parseFloat(getComputedStyle(el_longest).fontSize)
    const F = 0.05*fsz
    let f = fsz
    while (f > 10 && el_longest.clientWidth < el_longest.scrollWidth) {
      el_longest.style.fontSize = (f -= F) + 'px'
    }
    el_longest.remove()
    //
    el_uthm_txt.style.setProperty('--size', f+'px')
  }, 50)
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
