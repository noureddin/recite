// parsing preferences (not verses) url params

function parse_fbrate (fb) {
  switch (fb.toLowerCase()) {
    case 'l': case 'ltr': case 'letter':  return 'l'
    case 'w': case 'word':                return 'w'
    case 'a': case 'aya': case 'aaya':    return 'a'
  }
}

function parse_lines (ln) {
  switch (ln.toLowerCase()) {
    case '':   case 'pr':   return 'pr'
    case 'nb': case 'no':   return 'nb'
    case 'ay': case 'aya':  return 'ay'
  }
}

function parse_color (color) {
  switch (color.toLowerCase()) {
    case 't': case 'taj': case 'tajweed':  return 'taj'
    case 'b': case 'bas': case 'basic':    return 'bas'
    case 'n': case 'no':  case 'none':     return 'no'
  }
}

function parse_quizmode (quizmode) {
  switch (quizmode.toLowerCase()) {
    case 'i': case 'imla': case 'imlaai':   return 'imla'
    case 'u': case 'uthm': case 'uthmani':  return 'uthm'
  }
}

function parse_mv (mv) {
  switch (mv.toLowerCase()) {
    case '':
    case 'b':  return 'b'
    case 'r':  return 'r'
    case 'l':  return 'l'
  }
}

function __opturl (params) {
  const o = {}
  params
    .map(p => p.split('='))
    //.reduce((obj, cur, i) => { i == 0 ? {} : (obj[cur[0]] = cur[1], obj), {})
    .forEach((e, i) => {
      const is_of = (params) => params.trim().split(/ +/).includes(e[0])
      if (false) {}  // just for branching symmetry (something trailing commas)

      // dark mode: d/dark; l/light (default).
      else if (is_of('dark d'))   o.dark = true
      else if (is_of('light l'))  o.dark = false

      // color of text: c/color = t/taj/tajweed (default); b/bas/basic; n/no/none.
      else if (is_of('color c'))  o.color = parse_color(e[1]) || o.color

      // position of buttons: m/mv/mvbtns = b (bottom; default); r (right); l (left).
      else if (is_of('mvbtns mv m'))  o.mv = parse_mv(e[1]) || o.mv

      // quiz mode: q/qz/quizmode = u/uthm/uthmani (no-typing; default); i/imla/imlaai (typing)
      else if (is_of('quizmode qz q'))  o.quizmode = parse_quizmode(e[1]) || o.quizmode
      else if (is_of('txt'))            o.quizmode = 'imla'

      // imlaai-mode feedback rate: 'l' (by letter; default), 'w' (by word), 'a' (by aaya)
      else if (is_of('byaaya'))    o.fbrate = 'a'
      else if (is_of('byword'))    o.fbrate = 'w'
      else if (is_of('byletter'))  o.fbrate = 'l'
      else if (is_of('by'))        o.fbrate = parse_fbrate(e[1]) || o.fbrate

      // uthmani-mode linebreaks mode: default 'ay' (between ayat); 'pr' (like printed Muṣħaf al-Madīna); 'nb' (flowing w/o forced breaks)
      else if (is_of('  linebreaks'))     o.lines = 'ay'
      else if (is_of('nolinebreaks nb'))  o.lines = 'nb'
      else if (is_of('printlines pr'))    o.lines = 'pr'
      else if (is_of('lines'))            o.lines = parse_lines(e[1]) || o.lines || 'pr'

      // uthmani-mode gaps after waqf signs (EXPERIMENTAL, and not even exactly like Muṣħaf Dar-ul-Ma‘refa)
      else if (is_of('  gaps'))  o.gaps = true
      else if (is_of('nogaps'))  o.gaps = false

      // select tafsir; the ascii smallcase IDs found in odd-numbered lines in res/tafasir, eg 'katheer' or 'en_sahih'
      else if (is_of('tafsir'))  o.tafsir = e[1]

      // audio recitation qari's id
      else if (is_of('qari'))  o.qari = e[1]

      // user-provided audio recitation base_url
      else if (is_of('qariurl'))  o.qariurl = e[1]

      // teacher mode (audio recitation before ayah): t/teach/teacher (true); n/noteach/noteacher (false; default)
      else if (is_of('  teacher   teach t'))  o.teacher = true
      else if (is_of('noteacher noteach n'))  o.teacher = false

      // remove teacher mode selector from the UI, teacher mode can still be set from the URL: dt/disableteacher
      else if (is_of('disableteacher dt'))  o.disableteacher = true

      // remove quiz mode selector from the UI, quiz mode can still be set from the URL: dq/disablequizmode
      else if (is_of('disablequizmode dq'))  o.disablequizmode = true

      // disable the ability to preview ayat (doesn't prevent the use of the url param p/preview)
      else if (is_of('disablepreview dv dp'))  o.disablepreview = true

      // disable the ability to press '!' ten times to show one letter in imlaai mode
      else if (is_of('disablecheat dc'))  o.disablecheat = true

      // keyboard layout emulation (for imlaai & searching); see https://www.noureddin.dev/kbt/ (same ids, w/o '-ar')
      else if (is_of('emulation emulate emu'))  o.emulate = e[1]

      // high-contrast, dark colorscheme (affects uthmani & imlaai)
      else if (is_of('highcontrast hc'))  o.highcontrast = true

      // use a lower contrast imlaai bg color when wrong (can be used with highcontrast)
      else if (is_of('lowcontrast lc'))  o.lowcontrast = true

      // make imla_txt fill the entire page while quizzing, like Recite Desktop (PyQt5, in the `master` branch)
      else if (is_of('fullpage fp'))  o.fullpage = true

      // make imla_txt without border or outline
      else if (is_of('noborder'))  o.noborder = true

      // disable colorization of ayat numbers in Uthmani mode
      else if (is_of('  numcolor   nc'))  o.nonumcolor = false
      else if (is_of('nonumcolor nonc'))  o.nonumcolor = true

      // don't show the tajweed colors legend in Uthmani mode
      else if (is_of('  tajweedlegend   tl'))  o.notajweedlegend = false
      else if (is_of('notajweedlegend notl'))  o.notajweedlegend = true

      // hide recitation range in words, for random quizzing purposes (currently doesn't affect preview)
      else if (is_of('  notitle noti'))  o.notitle = true
      else if (is_of('showtitle'))       o.notitle = false

      // uthmani text workarounds for Blink; search z.js for blink_engine
      else if (is_of('  wa'))  o.wa = true
      else if (is_of('nowa'))  o.wa = false

      // continuation; ie, append a "phrase" from the next aaya if in the same sura
      else if (is_of('cn'))  o.cn = true

      // enable embedded integration: zz (cannot be disabled if enabled)
      else if (is_of('zz'))  o.zz = true

      // enable another kind of embedded integration
      else if (is_of('rr'))  o.rr = true

      // advance (show) first N words of the first aaya (only if embedded)
      else if (is_of('words'))  o.words = +e[1]

      // test the lengths of printed-like lines
      else if (is_of('testlonglines'))  o.testlonglines = true

    })
  return o
}

function update_options (el, param, stored, Default) {
  el.value = param != null ? param : S.getItem(stored)
  if (!el.value) { el.value = Default }  // if unset or is a bad value
  if (el.value === Default) { S.removeItem(stored) }
  else { S.setItem(stored, el.value) }
  el.onchange()
}

function update_bool_default_true (el, param, stored) {
  el.checked = param != null ? !param : !S.getItem(stored)
  store_bool(stored, !el.checked)
  el.onchange()
}

function parse_opturl () {
  const o = __opturl((L.search + L.hash).split(/[ ?#&]|%20/))
  //
  if (o.quizmode == null) {
    if (S.imla) {
      el_quizmode.value = 'imla'
      el_quizmode.onchange()
    }
  }
  else {
    el_quizmode.value = o.quizmode
    el_quizmode.onchange()
    store_bool('imla', o.quizmode === 'imla')
  }
  //
  if (o.highcontrast) { el_body.classList.add('highcontrast') }
  if (o.lowcontrast)  { el_body.classList.add('lowcontrast') }
  //
  if (o.dark == null && S.getItem('dark') == null) {  // no overriding; follow system preference initially
    o.dark = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  else {
    if (o.dark != null) { S.setItem('dark', o.dark ? 'Y' : 'N') }
  }
  el_darkmode_input.checked = o.dark || S.dark === 'Y'
  el_darkmode_input.onchange()
  //
  // TODO: add a url param for this '^_^
  window.prefers_reduced_motion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  //
  if (o.teacher == null) {
    el_teacher.checked = !!S.teacher
  }
  else {
    el_teacher.checked = o.teacher
    store_bool('teacher', o.teacher)
  }
  //
  update_options(el_tafsir_option, o.tafsir, 'tafsir', 'ar_muyassar')
  update_options(el_qaris,         o.qari,   'qari',   '')
  update_options(el_mvbtns_input,  o.mv,     'mvbtns', 'b')
  update_options(el_feedbackrate,  o.fbrate, 'fbrate', 'l')
  update_options(el_lines_input,   o.lines,  'lines',  'ay')
  //
  if (o.qariurl) { el_qaris.value = '_' }  // an invalid value to hide "Without audio"
  el_qariurl.value = o.qariurl ? o.qariurl : ''
  //
  el_textclr_input.value = o.color != null ? o.color : S.notajweed ? 'no' : 'taj'
  if (el_textclr_input.value !== 'taj') { S.setItem('notajweed', 'Y') }
  el_textclr_input.onchange()
  //
  update_bool_default_true(el_ayatnum_input,    o.nonumcolor,      'noayatnumcolor')
  update_bool_default_true(el_tl_input,         o.notajweedlegend, 'notajweedlegend')
  //
  const hide = (e) => e.style.display = 'none'
  //
  if (o.disableteacher) {
    hide(el_teacher_option)
  }
  //
  if (o.disablequizmode) {
    hide(el_quizmode_option)
    Qall('.mode_options_title').forEach(hide)
  }
  //
  if (o.disablepreview) {
    hide(el_show)
    // el_reshow is hidden in hide_selectors()
  }
  //
  // options that don't have a visible ui input (in addition to qariurl & high/low contrast)
  window.allow_cheating = !o.disablecheat  // cheating is allowed by default
  window.dont_show_title = !!o.notitle
  window.uthmani_gaps = !!o.gaps
  window.random_recitation = !!o.rr
  window.get_continuation = !!o.cn
  window.is_embedded = window.random_recitation || !!o.zz
  if (o.emulate && mappings[o.emulate]) { window.emulate = o.emulate }
  if (o.fullpage) { el_body.classList.add('fullpage') }
  if (o.noborder) { el_imla_txt.classList.add('noborder') }
  if (window.is_embedded && o.words && !isNaN(o.words)) { window.show_words = o.words }
  //
  // text workarounds for Blink; search z.js for blink_engine
  if (o.wa != null) {
    window.blink_engine = o.wa
  }
  else {
    const ua = window.navigator.userAgent
    window.blink_engine = ua.includes('Chrome') // || ua.includes('Safari') // Safari is much more broken
  }
  //
  if (o.testlonglines) {
    addEventListener('load', testlonglines)
  }
}
parse_opturl()
