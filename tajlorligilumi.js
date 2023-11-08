// ligilumi: to parse url parameters
// tajlori: to personalize
// tajlorligilumi: parsing preferences (not verses) url params

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
   || mv == 'b') { return 'bottom' }
  if (mv == 'r') { return 'right' }
  if (mv == 'l') { return 'left' }
}

function _tajlorligilumilo (params) {
  let dark             // dark mode: d/dark; l/light (default).
  let color = 'taj'    // color of text: c/color = t/taj/tajweed (default); b/bas/basic; n/no/none.
  let mv = 'bottom'    // position of buttons: m/mv/mvbtns = b (bottom; default); r (right); l (left).
  let quizmode         // quiz mode: q/qz/quizmode = u/uthm/uthmani (no-typing; default); i/imla/imlaai (typing)
  let byword           // imlaai-mode feedback rate; default); byword (true)
  let nolinebreaks     // uthmani-mode linebreaks between ayat (default: linebreaks)
  let qari             // audio recitation qari's id
  let qariurl          // user-provided audio recitation base_url
  let teacher          // teacher mode (audio recitation before ayah): t/teach/teacher (true); n/noteach/noteacher (false; default)
  let disableteacher   // remove teacher mode selector from the UI, teacher mode can still be set from the URL: dt/disableteacher
  let disablequizmode  // remove quiz mode selector from the UI, quiz mode can still be set from the URL: dq/disablequizmode
  let highcontrast     // high-contrast, dark colorscheme
  let lowcontrast      // use a lower contrast imlaai bg color when wrong (not incompatible with highcontrast)
  let emulate          // keyboard layout emulation; see https://noureddin.github.io/kbt (same ids, w/o '-ar')
  let cn               // continuation; ie, append a "phrase" from the next aaya if in the same sura
  let zz               // enable embedded integration: zz (cannot be disabled if enabled)
  params
    .slice(1)  // remove the first character (`?` or `#`)
    .split('&')
    .map(p => p.split('='))
    //.reduce((obj, cur, i) => { i == 0? {} : (obj[cur[0]] = cur[1], obj), {})
    .forEach((e, i) => {
      const is_of = (...params) => params.includes(e[0])
           if (is_of('dark', 'd'))                   {            dark = true                             }
      else if (is_of('light', 'l'))                  {            dark = false                            }
      else if (is_of('color', 'c'))                  {           color = parse_color(e[1]) || color       }
      else if (is_of('mvbtns', 'mv', 'm'))           {              mv = parse_mv(e[1]) || mv             }
      else if (is_of('quizmode', 'qz', 'q'))         {        quizmode = parse_quizmode(e[1]) || quizmode }
      else if (is_of('txt'))                         {        quizmode = parse_quizmode('imlaai')         }
      else if (is_of('byword'))                      {          byword = true                             }
      else if (is_of('byletter'))                    {          byword = false                            }
      else if (is_of(  'linebreaks'))                {    nolinebreaks = false                            }
      else if (is_of('nolinebreaks'))                {    nolinebreaks = true                             }
      else if (is_of('t',   'teach',   'teacher'))   {         teacher = true                             }
      else if (is_of('n', 'noteach', 'noteacher'))   {         teacher = false                            }
      else if (is_of('dt', 'disableteacher'))        {  disableteacher = true                             }
      else if (is_of('dq', 'disablequizmode'))       { disablequizmode = true                             }
      else if (is_of('hc', 'highcontrast'))          {    highcontrast = true                             }
      else if (is_of('lc', 'lowcontrast'))           {     lowcontrast = true                             }
      else if (is_of('emu', 'emulate', 'emulation')) {         emulate = e[1]                             }
      else if (is_of('qari'))                        {            qari = e[1]                             }
      else if (is_of('qariurl'))                     {         qariurl = e[1]                             }
      else if (is_of('cn'))                          {              cn = true                             }
      else if (is_of('zz'))                          {              zz = true                             }
    })
  let opts = {
    dark,
    color,
    mv,
    quizmode,
    byword,
    nolinebreaks,
    teacher,
    disableteacher,
    disablequizmode,
    highcontrast,
    lowcontrast,
    emulate,
    qari,
    qariurl,
    cn,
    zz,
  }
  return opts
}

function tajlorligilumi () {
  const opts = _tajlorligilumilo(window.location.hash || window.location.search)
  //
  opts.quizmode = opts.quizmode != null? opts.quizmode : Qid('quizmode').value
  Qid('quizmode').value = opts.quizmode
  Qid('quizmode').onchange()
  //
  if (opts.highcontrast) {
    Qid('body').classList.add('highcontrast')
  }
  delete opts.highcontrast
  //
  if (opts.lowcontrast) {
    Qid('body').classList.add('lowcontrast')
  }
  delete opts.lowcontrast
  //
  if (opts.dark == null) {  // no overriding; follow system preference initially
    opts.dark = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  Qid('darkmode_input').checked = opts.dark
  Qid('darkmode_input').onchange()
  delete opts.dark
  //
  Qid('teacher_input').checked = opts.teacher
  //
  Qid('qaris').value = opts.qari
  if (!Qid('qaris').value) { Qid('qaris').value = '' }  // if unset or is a bad value
  Qid('qaris').oninput()
  //
  if (opts.qariurl) { Qid('qaris').value = '_' }  // an invalid value to hide "With audio"
  Qid('qariurl').value = opts.qariurl ? opts.qariurl : ''
  //
  Qid('textclr_input').value = opts.color
  Qid('textclr_input').onchange()
  delete opts.color
  //
  Qid('mvbtns_input').value = opts.mv
  Qid('mvbtns_input').onchange()
  delete opts.mv
  //
  Qid('feedbackrate').value = opts.byword? 'word' : ''
  Qid('feedbackrate').onchange()
  delete opts.byword
  //
  Qid('linebreaks_input').checked = !opts.nolinebreaks
  Qid('linebreaks_input').onchange()
  delete opts.nolinebreaks
  //
  const hide = (e) => e.style.display = 'none'
  //
  if (opts.disableteacher) {
    hide(Qid('teacher_option'))
  }
  delete opts.disableteacher
  //
  if (opts.disablequizmode) {
    hide(Qid('quizmode_option'))
    Qall('.mode_options_title').forEach(hide)
  }
  delete opts.disablequizmode
  //
  if (opts.emulate && mappings[opts.emulate]) {
    window.emulate = opts.emulate  // it's an option, but a hidden one.
  }
}
tajlorligilumi()
