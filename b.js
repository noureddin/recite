
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

