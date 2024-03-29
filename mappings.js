
function insert_in_field (el, ch) {
  if (!ch) { return }
  // https://stackoverflow.com/a/11077016 and comments, with modifications
  const st = el.selectionStart
  const en = el.selectionEnd
  //
  const before = el.value.substring(0, st)
  const after  = el.value.substring(en, el.value.length)
  //
  el.value = before + ch + after
  // restore cursor position
  el.selectionStart = el.selectionEnd = st + ch.length
}

const mappings = {
  arak: {
    Backquote: ['`', '~'],
    Minus: ['[', '{'],
    Equal: [']', '}'],
    KeyQ: ['ض', '"'],
    KeyW: ['ع', 'غ'],
    KeyE: ['ب', 'پ'],
    KeyR: ['ح', 'َ'],
    KeyT: ['س', 'ً'],
    KeyY: ['خ', 'ٌ'],
    KeyU: ['د', 'ُ'],
    KeyI: ['أ', 'آ'],
    KeyO: ['ك', 'گ'],
    KeyP: ['ج', 'چ'],
    BracketLeft: ['/', '؟'],
    BracketRight: ['=', '+'],
    KeyA: ['ه', '؛'],
    KeyS: ['ي', '»'],
    KeyD: ['م', '«'],
    KeyF: ['ن', 'ْ'],
    KeyG: ['ف', 'ڤ'],
    KeyH: ['ت', 'ث'],
    KeyJ: ['ل', 'ّ'],
    KeyK: ['ا', 'ء'],
    KeyL: ['و', 'ؤ'],
    Semicolon: ['ر', '>'],
    Quote: ['إ', '<'],
    KeyZ: ['.', ':'],
    KeyX: ['،', 'ـ'],
    KeyC: ['ش', '_'],
    KeyV: ['ق', '-'],
    KeyB: ['ص', "'"],
    KeyN: ['ذ', 'ٍ'],
    KeyM: ['ة', 'ِ'],
    Comma: ['ى', 'ئ'],
    Period: ['ز', 'ژ'],
    Slash: ['ط', 'ظ'],
  },
  dv: {
    Backquote: ['`', '~'],
    Minus: ['[', '{'],
    Equal: [']', '}'],
    KeyQ: ["'", '"'],
    KeyW: ['،', '<'],
    KeyE: ['.', '>'],
    KeyR: ['ط', 'ظ'],
    KeyT: ['ى', 'آ'],
    KeyY: ['ف', 'ڤ'],
    KeyU: ['غ', 'ـ'],
    KeyI: ['ص', 'ض'],
    KeyO: ['ر', '»'],
    KeyP: ['ل', '«'],
    BracketLeft: ['/', '؟'],
    BracketRight: ['=', '+'],
    KeyA: ['ا', 'أ'],
    KeyS: ['ع', 'إ'],
    KeyD: ['ه', 'ة'],
    KeyF: ['و', 'ؤ'],
    KeyG: ['ي', 'ئ'],
    KeyH: ['د', 'َ'],
    KeyJ: ['ح', 'ً'],
    KeyK: ['ت', 'ٌ'],
    KeyL: ['ن', 'ُ'],
    Semicolon: ['س', 'ش'],
    Quote: ['-', '_'],
    KeyZ: ['؛', ':'],
    KeyX: ['ق', 'ء'],
    KeyC: ['ج', 'چ'],
    KeyV: ['ك', 'گ'],
    KeyB: ['خ', 'ْ'],
    KeyN: ['ب', 'پ'],
    KeyM: ['م', 'ّ'],
    Comma: ['ث', 'ٍ'],
    Period: ['ذ', 'ِ'],
    Slash: ['ز', 'ژ'],
  },
  ibm: {
    Backquote: ['ذ', 'ّ'],
    Minus: ['-', '_'],
    Equal: ['=', '+'],
    KeyQ: ['ض', 'َ'],
    KeyW: ['ص', 'ً'],
    KeyE: ['ث', 'ُ'],
    KeyR: ['ق', 'ٌ'],
    KeyT: ['ف', 'لإ'],
    KeyY: ['غ', 'إ'],
    KeyU: ['ع', '`'],
    KeyI: ['ه', '÷'],
    KeyO: ['خ', '×'],
    KeyP: ['ح', '؛'],
    BracketLeft: ['ج', '<'],
    BracketRight: ['د', '>'],
    KeyA: ['ش', 'ِ'],
    KeyS: ['س', 'ٍ'],
    KeyD: ['ي', ']'],
    KeyF: ['ب', '['],
    KeyG: ['ل', 'لأ'],
    KeyH: ['ا', 'أ'],
    KeyJ: ['ت', 'ـ'],
    KeyK: ['ن', '،'],
    KeyL: ['م', '/'],
    Semicolon: ['ك', ':'],
    Quote: ['ط', '"'],
    KeyZ: ['ئ', '~'],
    KeyX: ['ء', 'ْ'],
    KeyC: ['ؤ', '}'],
    KeyV: ['ر', '{'],
    KeyB: ['لا', 'لآ'],
    KeyN: ['ى', 'آ'],
    KeyM: ['ة', "'"],
    Comma: ['و', ','],
    Period: ['ز', '.'],
    Slash: ['ظ', '؟'],
  },
  mac: {
    Backquote: ['§', '±'],
    Minus: ['-', '_'],
    Equal: ['=', '+'],
    KeyQ: ['ض', 'َ'],
    KeyW: ['ص', 'ً'],
    KeyE: ['ث', 'ِ'],
    KeyR: ['ق', 'ٍ'],
    KeyT: ['ف', 'ُ'],
    KeyY: ['غ', 'ٌ'],
    KeyU: ['ع', 'ْ'],
    KeyI: ['ه', 'ّ'],
    KeyO: ['خ', ']'],
    KeyP: ['ح', '['],
    BracketLeft: ['ج', '}'],
    BracketRight: ['ة', '{'],
    KeyA: ['ش', '»'],
    KeyS: ['س', '«'],
    KeyD: ['ي', 'ى'],
    KeyF: ['ب', ''],
    KeyG: ['ل', ''],
    KeyH: ['ا', 'آ'],
    KeyJ: ['ت', ''],
    KeyK: ['ن', ''],
    KeyL: ['م', ''],
    Semicolon: ['ك', ':'],
    Quote: ['؛', '"'],
    KeyZ: ['ظ', ''],
    KeyX: ['ط', ''],
    KeyC: ['ذ', 'ئ'],
    KeyV: ['د', 'ء'],
    KeyB: ['ز', 'أ'],
    KeyN: ['ر', 'إ'],
    KeyM: ['و', 'ؤ'],
    Comma: ['،', '>'],
    Period: ['.', '<'],
    Slash: ['/', '؟'],
  },
}
