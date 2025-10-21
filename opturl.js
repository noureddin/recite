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
  let dark             // dark mode: d/dark; l/light (default).
  let color            // color of text: c/color = t/taj/tajweed (default); b/bas/basic; n/no/none.
  let mv               // position of buttons: m/mv/mvbtns = b (bottom; default); r (right); l (left).
  let quizmode         // quiz mode: q/qz/quizmode = u/uthm/uthmani (no-typing; default); i/imla/imlaai (typing)
  let fbrate           // imlaai-mode feedback rate: 'l' (by letter; default), 'w' (by word), 'a' (by aaya)
  let nolinebreaks     // uthmani-mode linebreaks between ayat (default: linebreaks)
  let qari             // audio recitation qari's id
  let qariurl          // user-provided audio recitation base_url
  let teacher          // teacher mode (audio recitation before ayah): t/teach/teacher (true); n/noteach/noteacher (false; default)
  let disableteacher   // remove teacher mode selector from the UI, teacher mode can still be set from the URL: dt/disableteacher
  let disablequizmode  // remove quiz mode selector from the UI, quiz mode can still be set from the URL: dq/disablequizmode
  let disablepreview   // disable the ability to preview ayat (doesn't prevent the use of the url param p/preview)
  let disablecheat     // disable the ability to press '!' ten times to show one letter in imlaai mode
  let highcontrast     // high-contrast, dark colorscheme
  let lowcontrast      // use a lower contrast imlaai bg color when wrong (can be used with highcontrast)
  let tafsir           // select tafsir; the ascii smallcase IDs found in odd-numbered lines in res/tafasir, eg 'katheer' or 'en_sahih'
  let emulate          // keyboard layout emulation; see https://www.noureddin.dev/kbt/ (same ids, w/o '-ar')
  let fullpage         // make imla_txt fill the entire page while quizzing, like Recite Desktop (PyQt5, in the `master` branch)
  let noborder         // make imla_txt without border or outline
  let nonumcolor       // disable colorization of ayat numbers in Uthmani mode
  let notajweedlegend  // don't show the tajweed colors legend in Uthmani mode
  let notitle          // hide recitation range in words, for random quizzing purposes (currently doesn't affect preview)
  let wa               // text workarounds for Blink; search z.js for blink_engine
  let cn               // continuation; ie, append a "phrase" from the next aaya if in the same sura
  let zz               // enable embedded integration: zz (cannot be disabled if enabled)
  let rr               // enable another kind of embedded integration
  let words            // advance (show) first N words of the first aaya (only if embedded)
  params
    .map(p => p.split('='))
    //.reduce((obj, cur, i) => { i == 0 ? {} : (obj[cur[0]] = cur[1], obj), {})
    .forEach((e, i) => {
      const is_of = (...params) => params.includes(e[0])
           if (is_of('dark', 'd'))                   {            dark = true                               }
      else if (is_of('light', 'l'))                  {            dark = false                              }
      else if (is_of('color', 'c'))                  {           color = parse_color(e[1]) || color         }
      else if (is_of('mvbtns', 'mv', 'm'))           {              mv = parse_mv(e[1]) || mv               }
      else if (is_of('quizmode', 'qz', 'q'))         {        quizmode = parse_quizmode(e[1]) || quizmode   }
      else if (is_of('txt'))                         {        quizmode = parse_quizmode('imlaai')           }
      else if (is_of('byaaya'))                      {          fbrate = 'a'                                }
      else if (is_of('byword'))                      {          fbrate = 'w'                                }
      else if (is_of('byletter'))                    {          fbrate = 'l'                                }
      else if (is_of('by'))                          {          fbrate = parse_fbrate(e[1]) || fbrate       }
      else if (is_of(  'linebreaks'))                {    nolinebreaks = false                              }
      else if (is_of('nolinebreaks'))                {    nolinebreaks = true                               }
      else if (is_of('t',   'teach',   'teacher'))   {         teacher = true                               }
      else if (is_of('n', 'noteach', 'noteacher'))   {         teacher = false                              }
      else if (is_of('dt', 'disableteacher'))        {  disableteacher = true                               }
      else if (is_of('dq', 'disablequizmode'))       { disablequizmode = true                               }
      else if (is_of('dv', 'dp', 'disablepreview'))  {  disablepreview = true                               }
      else if (is_of('dc', 'disablecheat'))          {    disablecheat = true                               }
      else if (is_of('hc', 'highcontrast'))          {    highcontrast = true                               }
      else if (is_of('lc', 'lowcontrast'))           {     lowcontrast = true                               }
      else if (is_of('emu', 'emulate', 'emulation')) {         emulate = e[1]                               }
      else if (is_of('qari'))                        {            qari = e[1]                               }
      else if (is_of('qariurl'))                     {         qariurl = e[1]                               }
      else if (is_of('tafsir'))                      {          tafsir = e[1]                               }
      else if (is_of('fp', 'fullpage'))              {        fullpage = true                               }
      else if (is_of('noborder'))                    {        noborder = true                               }
      else if (is_of('nc', 'numcolor'))              {      nonumcolor = false                              }
      else if (is_of('nonc', 'nonumcolor'))          {      nonumcolor = true                               }
      else if (is_of('tl', 'tajweedlegend'))         { notajweedlegend = false                              }
      else if (is_of('notl', 'notajweedlegend'))     { notajweedlegend = true                               }
      else if (is_of('noti', 'notitle'))             {         notitle = true                               }
      else if (is_of('showtitle'))                   {         notitle = false                              }
      else if (is_of('wa'))                          {              wa = true                               }
      else if (is_of('nowa'))                        {              wa = false                              }
      else if (is_of('cn'))                          {              cn = true                               }
      else if (is_of('zz'))                          {              zz = true                               }
      else if (is_of('rr'))                          {              rr = true                               }
      else if (is_of('words'))                       {           words = +e[1]                              }
    })
  let opts = {
    dark,
    color,
    mv,
    quizmode,
    fbrate,
    nolinebreaks,
    teacher,
    disableteacher,
    disablequizmode,
    disablepreview,
    disablecheat,
    highcontrast,
    lowcontrast,
    emulate,
    qari,
    qariurl,
    tafsir,
    fullpage,
    noborder,
    nonumcolor,
    notajweedlegend,
    notitle,
    wa,
    cn,
    zz,
    rr,
    words,
  }
  return opts
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
  const opts = __opturl((L.search + L.hash).split(/[ ?#&]|%20/))
  //
  if (opts.quizmode == null) {
    if (S.imla) {
      el_quizmode.value = 'imla'
      el_quizmode.onchange()
    }
  }
  else {
    el_quizmode.value = opts.quizmode
    el_quizmode.onchange()
    store_bool('imla', opts.quizmode === 'imla')
  }
  //
  if (opts.highcontrast) { el_body.classList.add('highcontrast') }
  if (opts.lowcontrast)  { el_body.classList.add('lowcontrast') }
  //
  if (opts.dark == null && S.getItem('dark') == null) {  // no overriding; follow system preference initially
    opts.dark = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  else {
    if (opts.dark != null) { S.setItem('dark', opts.dark ? 'Y' : 'N') }
  }
  el_darkmode_input.checked = opts.dark || S.dark === 'Y'
  el_darkmode_input.onchange()
  //
  // TODO: add a url param for this '^_^
  window.prefers_reduced_motion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  //
  if (opts.teacher == null) {
    el_teacher.checked = !!S.teacher
  }
  else {
    el_teacher.checked = opts.teacher
    store_bool('teacher', opts.teacher)
  }
  //
  update_options(el_tafsir_option, opts.tafsir, 'tafsir', 'ar_muyassar')
  update_options(el_qaris,         opts.qari,   'qari',   '')
  update_options(el_mvbtns_input,  opts.mv,     'mvbtns', 'b')
  update_options(el_feedbackrate,  opts.fbrate, 'fbrate', 'l')
  //
  if (opts.qariurl) { el_qaris.value = '_' }  // an invalid value to hide "Without audio"
  el_qariurl.value = opts.qariurl ? opts.qariurl : ''
  //
  el_textclr_input.value = opts.color != null ? opts.color : S.notajweed ? 'no' : 'taj'
  if (el_textclr_input.value !== 'taj') { S.setItem('notajweed', 'Y') }
  el_textclr_input.onchange()
  //
  update_bool_default_true(el_linebreaks_input, opts.nolinebreaks,    'nolinebreaks')
  update_bool_default_true(el_ayatnum_input,    opts.nonumcolor,      'noayatnumcolor')
  update_bool_default_true(el_tl_input,         opts.notajweedlegend, 'notajweedlegend')
  //
  const hide = (e) => e.style.display = 'none'
  //
  if (opts.disableteacher) {
    hide(el_teacher_option)
  }
  //
  if (opts.disablequizmode) {
    hide(el_quizmode_option)
    Qall('.mode_options_title').forEach(hide)
  }
  //
  if (opts.disablepreview) {
    hide(el_show)
    // el_reshow is hidden in hide_selectors()
  }
  //
  // options that don't have a visible ui input (in addition to qariurl & high/low contrast)
  window.allow_cheating = !opts.disablecheat  // cheating is allowed by default
  window.dont_show_title = !!opts.notitle
  window.random_recitation = !!opts.rr
  window.get_continuation = !!opts.cn
  window.is_embedded = window.random_recitation || !!opts.zz
  if (opts.emulate && mappings[opts.emulate]) { window.emulate = opts.emulate }
  if (opts.fullpage) { el_body.classList.add('fullpage') }
  if (opts.noborder) { el_imla_txt.classList.add('noborder') }
  if (window.is_embedded && opts.words && !isNaN(opts.words)) { window.show_words = opts.words }
  //
  // text workarounds for Blink; search z.js for blink_engine
  if (opts.wa != null) {
    window.blink_engine = opts.wa
  }
  else {
    const ua = window.navigator.userAgent
    window.blink_engine = ua.includes('Chrome') // || ua.includes('Safari') // Safari is even more broken
  }
}
parse_opturl()
