// I know that the JS naming convention is to use lowerCamelCase for variables
// and functions. But I decided to use snake_case exclusively to make my
// functions visually distinct from those of JS, especially b/c I have functions
// with similar names, eg scroll_to_top. I also use it for variables and consts.
// The only exception is the following two shorthand functions.

function Q(selector) { return document.querySelector(selector) }
function Qid(id)     { return document.getElementById(id) }

<<!!bash -c 'for id in {sura,aaya}_{beg,end} txt selectors ok header title new endmsg; do echo "const el_$id = Qid(\"$id\")"; done'>>

function hide_el(el) { el.hidden = true;  el.style.visibility = "hidden";  el.style.opacity =   "0%" }
function show_el(el) { el.hidden = false; el.style.visibility = "visible"; el.style.opacity = "100%" }

function update_aaya_input_if_empty(beg_or_end) {
  const el_aaya = Qid("aaya_"+beg_or_end)
  const el_sura = Qid("sura_"+beg_or_end)
  if (el_aaya.value === "" && el_sura.value !== "") {
    el_aaya.value = 1
    selectors_changed(el_aaya)  // handles the filtering
  }
}

el_aaya_beg.addEventListener('focusout', e => update_aaya_input_if_empty("beg"))
el_aaya_end.addEventListener('focusout', e => update_aaya_input_if_empty("end"))

function disable_ok() { el_ok.disabled = true;  }
function enable_ok()  { el_ok.disabled = false; }


const suar_lengths = [7,286,200,176,120,165,206,75,129,109,123,111,43,52,99,128,111,110,98,135,112,78,118,64,77,227,93,88,69,60,34,30,73,54,45,83,182,88,75,85,54,53,89,59,37,35,38,29,18,45,60,49,62,55,78,96,29,22,24,13,14,11,11,18,12,12,30,52,52,44,28,28,20,56,40,31,50,40,46,42,29,19,36,25,22,17,19,26,30,20,15,21,11,8,8,19,5,8,8,11,11,8,3,9,5,4,7,3,6,3,5,4,5,6]
const suar_names = [<<!!sed "s/^/'/;s/$/',/" webres/suar-names | tr -d '\n' >>]
const ayat = [<<!!cat webres/imlaai-ayat-array | tr -d '\n' >>]

function filter_aaya_input(n) {  // remove non-numerals and convert numerals to Eastern Arabic
  return n.toString()
      .replace(/[0٠]/g, "٠")
      .replace(/[1١]/g, "١")
      .replace(/[2٢]/g, "٢")
      .replace(/[3٣]/g, "٣")
      .replace(/[4٤]/g, "٤")
      .replace(/[5٥]/g, "٥")
      .replace(/[6٦]/g, "٦")
      .replace(/[7٧]/g, "٧")
      .replace(/[8٨]/g, "٨")
      .replace(/[9٩]/g, "٩")
      .replace(/[^٠١٢٣٤٥٦٧٨٩]/g, "")
}
function defilter_aaya_input(n) {  // convert numerals to ASCII
  return n
      .replace(/٠/g, "0")
      .replace(/١/g, "1")
      .replace(/٢/g, "2")
      .replace(/٣/g, "3")
      .replace(/٤/g, "4")
      .replace(/٥/g, "5")
      .replace(/٦/g, "6")
      .replace(/٧/g, "7")
      .replace(/٨/g, "8")
      .replace(/٩/g, "9")
}

// check (and possibly update) suar/ayat-selectors
// return true if the input is valid
function validate_selectors(ev) {

  let sura_beg = el_sura_beg.value
  let sura_end = el_sura_end.value
  let aaya_beg = defilter_aaya_input(el_aaya_beg.value)
  let aaya_end = defilter_aaya_input(el_aaya_end.value)

  const set_aaya_beg = n => el_aaya_beg.value = filter_aaya_input(aaya_beg = +n)
  const set_aaya_end = n => el_aaya_end.value = filter_aaya_input(aaya_end = +n)

  // if the changed field is sura_beg, make aaya_beg 1 if empty,
  // and update sura_end if empty or is before sura_beg
  if (ev.id == "sura_beg") {
    if (aaya_beg === "")
      set_aaya_beg(1)
    if (sura_end === "" || +sura_end < +sura_beg) {
      sura_end = el_sura_end.value = sura_beg
      set_aaya_end(suar_lengths[sura_end])
    }
  }
  // if the changed field is sura_end, make aaya_end the last aya;
  // and update sura_beg if empty or is after sura_end
  else if (ev.id == "sura_end") {
    // if (aaya_end === "")
      set_aaya_end(suar_lengths[sura_end])
    if (sura_beg === "" || (sura_end !== "" && +sura_end < +sura_beg)) {
      sura_beg = el_sura_beg.value = sura_end
      set_aaya_beg(1)
    }
  }

  // make sure ayat are within limits:

  // ayat upper-limits:
  if (aaya_beg > suar_lengths[sura_beg]) set_aaya_beg(suar_lengths[sura_beg])
  if (aaya_end > suar_lengths[sura_end]) set_aaya_end(suar_lengths[sura_end])

  // ayat lower-limits:
  if (aaya_beg === "0") set_aaya_beg(1)
  if (aaya_end === "0") set_aaya_end(1)
  // a negative sign is not allowed to be entered
  // empty aaya-input is handled separately in a focusout handler

  return sura_beg !== "" && sura_end !== "" && aaya_beg !== "" && aaya_end !== ""
}

function selectors_changed(ev) {

  el_aaya_beg.value = filter_aaya_input(el_aaya_beg.value)
  el_aaya_end.value = filter_aaya_input(el_aaya_end.value)
  el_txt.placeholder = "اكتب هنا"

  if (!validate_selectors(ev)) {
    disable_ok()
    return
  }

  const sura_beg = +el_sura_beg.value
  const sura_end = +el_sura_end.value
  const aaya_beg = +defilter_aaya_input(el_aaya_beg.value)
  const aaya_end = +defilter_aaya_input(el_aaya_end.value)

  const st = +suar_lengths.slice(0, sura_beg).reduce((a,b)=>a+b, 0) + aaya_beg
  const en = +suar_lengths.slice(0, sura_end).reduce((a,b)=>a+b, 0) + aaya_end
  if (en <= st-1) { disable_ok(); return }  // should not happen!
  enable_ok()

  const input_trigger = function(ev) {
    // this fn is connected to onkeyup and onmouseup. it handles three "events"

    const on_ayat = ev.target.id === "aaya_beg" || ev.target.id === "aaya_end"
    const on_suar = ev.target.id === "sura_beg" || ev.target.id === "sura_end"

    // Enter on suar/ayat selection: set focus on the next element:
    //   sura_beg > aaya_beg > sura_end > aaya_end > ok
    // also, on the last element, get the next (ie first) word
    if (ev.key === "Enter" && (on_ayat || on_suar)) {
      (ev.target.id === "sura_beg"? el_aaya_beg :
       ev.target.id === "aaya_beg"? el_sura_end :
       ev.target.id === "sura_end"? el_aaya_end :
       ev.target.id === "aaya_end"? el_ok       :
       1).focus()
      return
    }


    // Up or Down on an ayat-input, increase or decrease it
    if (on_ayat) {
      const el = Qid(ev.target.id)
      if (ev.key === "ArrowUp")   el.value = 1 + +defilter_aaya_input(el.value)
      if (ev.key === "ArrowDown") el.value = 1 - +defilter_aaya_input(el.value)
      selectors_changed(el)  // handles the filtering
      return
    }

  }

  el_sura_beg.onkeyup = input_trigger
  el_aaya_beg.onkeyup = input_trigger
  el_sura_end.onkeyup = input_trigger
  el_aaya_end.onkeyup = input_trigger

  const make_title = function() {
    const sura_beg_val = el_sura_beg.value
    const sura_end_val = el_sura_end.value
    const aaya_beg_val = +defilter_aaya_input(el_aaya_beg.value)
    const aaya_end_val = +defilter_aaya_input(el_aaya_end.value)
    const sura_beg_txt = suar_names[el_sura_beg.value]
    const sura_end_txt = suar_names[el_sura_end.value]
    const aaya_beg_txt = filter_aaya_input(el_aaya_beg.value)
    const aaya_end_txt = filter_aaya_input(el_aaya_end.value)
    ////////////////////////////////////////////////////////////////////
    // handled cases:
    // - one aaya
    // - one or more complete suar (no partial sura)
    // - one partial sura
    // - anything else
    if (sura_beg_val === sura_end_val && aaya_beg_val === aaya_end_val) {
      return "تسميع سورة "+sura_beg_txt+" الآية "+aaya_beg_txt+"."
    }
    if (aaya_beg_val === 1 && aaya_end_val == suar_lengths[sura_end_val]) {
      const suar = suar_names.slice(sura_beg_val, +sura_end_val+1)
      const names = suar.join(" و")
      if (suar.length === 1)
        return "تسميع سورة "+names+" كاملة."
      if (suar.length === 2)
        return "تسميع سورتي "+names+" كاملتين."
      return "تسميع سور "+names+" كاملة."
    }
    if (sura_beg_val == sura_end_val) {
      return "تسميع سورة "+sura_beg_txt+" من الآية "+aaya_beg_txt+" إلى الآية "+aaya_end_txt+"."
    }
    return "تسميع من سورة "+sura_beg_txt+" الآية "+aaya_beg_txt+" إلى سورة "+sura_end_txt+" الآية "+aaya_end_txt+"."
  }

  const start_reciting = function(ev) {

    el_title.innerHTML = make_title()
    hide_el(el_selectors)
    show_el(el_txt)
    show_el(el_header)

    let done = false

    const correct_text = ayat
                .slice(st-1,en)
                .map(a => a.startsWith('#')? a.replace('#', 'بسم الله الرحمن الرحيم\n') : a)
                .join('\n')
    // console.log(correct_text)

    const txt_changed = function() {
      if (done)  return

      if (el_txt.value === correct_text) {
        done = true
        el_txt.disabled = true
        show_el(el_endmsg)
        el_txt.style.backgroundColor = "lightGreen"
      }
      else if (correct_text.startsWith(el_txt.value)) {
        el_txt.style.backgroundColor = ""
      }
      else {
        el_txt.style.backgroundColor = "pink"
      }
    }

    el_txt.addEventListener('input', txt_changed, false) // https://stackoverflow.com/a/14029861
    el_txt.focus()
  }

  el_ok.onmouseup = start_reciting
  el_ok.onclick = start_reciting

}

const init_selectors = function() {
  el_sura_beg.value = ""
  el_aaya_beg.value = ""
  el_sura_end.value = ""
  el_aaya_end.value = ""
  el_txt.value = ""
}

const show_selectors = function() {
  show_el(el_selectors)
  hide_el(el_header)
  hide_el(el_endmsg)
  hide_el(el_txt)
  el_txt.value = ""
  el_txt.disabled = false
  el_txt.style.backgroundColor = ""
}

onload = init_selectors
el_new.onmouseup = show_selectors
el_new.onclick = show_selectors


// vim: set sw=2 ts=2 et colorcolumn=80:
