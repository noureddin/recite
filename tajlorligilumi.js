// ligilumi: to parse url parameters
// tajlori: to personalize
// tajlorligilumi: parsing preferences (not verses) url params

const _fbrate_values = {
  l: 'l', letter: 'l',
  w: 'w', word: 'w',
  a: 'a', aaya: 'a',
}

function parse_fbrate (fb) {
  return _fbrate_values[ fb.toLowerCase() ]
}

const _color_values = {
  t: 'taj', taj: 'taj', tajweed: 'taj',
  b: 'bas', bas: 'bas', basic: 'bas',
  n: 'no',  no: 'no',   none: 'no',
}

function parse_color (color) {
  return _color_values[ color.toLowerCase() ]
}

const _quizmode_values = {
  i: 'imla', imla: 'imla', imlaai: 'imla',
  u: 'uthm', uthm: 'uthm', uthmani: 'uthm',
}

function parse_quizmode (quizmode) {
  return _quizmode_values[ quizmode.toLowerCase() ]
}

function parse_mv (mv) {
  mv = mv.toLowerCase()
  if (mv == ''
   || mv == 'b') { return 'b' }
  if (mv == 'r') { return 'r' }
  if (mv == 'l') { return 'l' }
}

function _tajlorligilumilo (params) {
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
  let lowcontrast      // use a lower contrast imlaai bg color when wrong (not incompatible with highcontrast)
  let tafsir           // select tafsir
  let emulate          // keyboard layout emulation; see https://noureddin.github.io/kbt (same ids, w/o '-ar')
  let fullpage         // make imla_txt fill the entire page while quizzing, like Recite Desktop (PyQt5, in the `master` branch)
  let noborder         // make imla_txt without border or outline
  let cn               // continuation; ie, append a "phrase" from the next aaya if in the same sura
  let zz               // enable embedded integration: zz (cannot be disabled if enabled)
  params
    .slice(1)  // remove the first character (`?` or `#`)
    .split('&')
    .map(p => p.split('='))
    //.reduce((obj, cur, i) => { i == 0 ? {} : (obj[cur[0]] = cur[1], obj), {})
    .forEach((e, i) => {
      const is_of = (...params) => params.includes(e[0])
           if (is_of('dark', 'd'))                   {            dark = true                             }
      else if (is_of('light', 'l'))                  {            dark = false                            }
      else if (is_of('color', 'c'))                  {           color = parse_color(e[1]) || color       }
      else if (is_of('mvbtns', 'mv', 'm'))           {              mv = parse_mv(e[1]) || mv             }
      else if (is_of('quizmode', 'qz', 'q'))         {        quizmode = parse_quizmode(e[1]) || quizmode }
      else if (is_of('txt'))                         {        quizmode = parse_quizmode('imlaai')         }
      else if (is_of('byaaya'))                      {          fbrate = 'a'                              }
      else if (is_of('byword'))                      {          fbrate = 'w'                              }
      else if (is_of('byletter'))                    {          fbrate = 'l'                              }
      else if (is_of('by'))                          {          fbrate = parse_fbrate(e[1]) || fbrate     }
      else if (is_of(  'linebreaks'))                {    nolinebreaks = false                            }
      else if (is_of('nolinebreaks'))                {    nolinebreaks = true                             }
      else if (is_of('t',   'teach',   'teacher'))   {         teacher = true                             }
      else if (is_of('n', 'noteach', 'noteacher'))   {         teacher = false                            }
      else if (is_of('dt', 'disableteacher'))        {  disableteacher = true                             }
      else if (is_of('dq', 'disablequizmode'))       { disablequizmode = true                             }
      else if (is_of('dp', 'disablepreview'))        {  disablepreview = true                             }
      else if (is_of('dc', 'disablecheat'))          {    disablecheat = true                             }
      else if (is_of('hc', 'highcontrast'))          {    highcontrast = true                             }
      else if (is_of('lc', 'lowcontrast'))           {     lowcontrast = true                             }
      else if (is_of('emu', 'emulate', 'emulation')) {         emulate = e[1]                             }
      else if (is_of('qari'))                        {            qari = e[1]                             }
      else if (is_of('qariurl'))                     {         qariurl = e[1]                             }
      else if (is_of('tafsir'))                      {          tafsir = e[1]                             }
      else if (is_of('fp', 'fullpage'))              {        fullpage = true                             }
      else if (is_of('noborder'))                    {        noborder = true                             }
      else if (is_of('cn'))                          {              cn = true                             }
      else if (is_of('zz'))                          {              zz = true                             }
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
    fullpage,
    noborder,
    cn,
    zz,
  }
  return opts
}

function update_options (el, param, stored, Default) {
  el.value = param != null ? param : S.getItem(stored)
  if (!el.value) { el.value = Default }  // if unset or is a bad value
  if (el.value !== Default) { S.setItem(stored, el.value) }
  el.onchange()
}

function update_bool_default_true (el, param, stored) {
  el.checked = param != null ? !param : !S.getItem(stored)
  store_bool(stored, !el.checked)
  el.onchange()
}

function tajlorligilumi () {
  const opts = _tajlorligilumilo(L.search + L.hash.replace(/^#/, '&'))
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
  if (opts.highcontrast) {
    el_body.classList.add('highcontrast')
  }
  //
  if (opts.lowcontrast) {
    el_body.classList.add('lowcontrast')
  }
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
  update_options(el_qaris, opts.qari, 'qari', '')
  update_options(el_mvbtns_input, opts.mv, 'mvbtns', 'b')
  update_options(el_feedbackrate, opts.fbrate, 'fbrate', 'l')
  //
  if (opts.qariurl) { el_qaris.value = '_' }  // an invalid value to hide "Without audio"
  el_qariurl.value = opts.qariurl ? opts.qariurl : ''
  //
  el_textclr_input.value = opts.color != null ? opts.color : S.notajweed ? 'no' : 'taj'
  if (el_textclr_input.value !== 'taj') { S.setItem('notajweed', 'Y') }
  el_textclr_input.onchange()
  //
  update_bool_default_true(el_linebreaks_input, opts.nolinebreaks, 'nolinebreaks')
  update_bool_default_true(el_ayatnum_input, null, 'noayatnumcolor')  // no url params yet
  update_bool_default_true(el_tl_input, null, 'notajweedlegend')  // no url params yet
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
  }
  //
  // options that don't have a visible ui input (in addition to qariurl & high/low contrast)
  window.allow_cheating = !opts.disablecheat  // cheating is allowed by default
  if (opts.emulate && mappings[opts.emulate]) { window.emulate = opts.emulate }
  if (opts.fullpage) { el_body.classList.add('fullpage') }
  if (opts.noborder) { el_imla_txt.classList.add('noborder') }
  if (opts.cn) { el_cn.value = opts.cn ? '1' : '' }
  if (opts.zz) { el_zz.value = opts.zz ? '1' : '' }
}
tajlorligilumi()
