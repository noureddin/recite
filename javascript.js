// I know that the JS naming convention is to use lowerCamelCase for variables
// and functions. But I decided to use snake_case exclusively to make my
// functions visually distinct from those of JS, especially b/c I have functions
// with similar names, eg scroll_to_top. I also use it for variables and consts.
// The only exception is the following two shorthand functions.

function Q(selector) { return document.querySelector(selector) }
function Qid(id)     { return document.getElementById(id) }

<<!!bash -c 'for id in {sura,aaya}_{beg,end} qaris player txt ok repeat up dn; do echo "const el_$id = Qid(\"$id\")"; done'>>

// from: https://github.com/mathusummut/confetti.js
// Copyright (c) 2018 MathuSum Mut. MIT License
<<!!cat webres/confetti.min.js>>

// global variables related to audio recitations
var audio_base_url
var ayat_recitations_list
var current_audio_index


function tajweed_colorize_aaya(a) {
  return a.replace(/([A-Z])<([^>]+)>/g, '<span_class="$1">$2</span>')
}


function help_toggled() {
  setTimeout(scroll_to_top, 100)
  setTimeout(show_hide_buttons, 500)
}

function update_aaya_input_if_empty(beg_or_end) {
  const el_aaya = Qid("aaya_"+beg_or_end)
  const el_sura = Qid("sura_"+beg_or_end)
  if (el_aaya.value === "" && el_sura.value !== "") {
    el_aaya.value = 1
    start_reciting(el_aaya)  // handles the filtering
  }
}

el_aaya_beg.addEventListener('focusout', e => update_aaya_input_if_empty("beg"))
el_aaya_end.addEventListener('focusout', e => update_aaya_input_if_empty("end"))

function scroll_to_top()    { window.scrollTo({ top: 0 }) }
function scroll_to_bottom() { window.scrollTo({ top: document.body.scrollHeight }) }

// based on https://stackoverflow.com/a/7557433
// return:
//    0 if at least half the element's height is in viewport;
//   +1 if at least half the element's height is out of view, under the screen;
//   -1 if at least half the element's height is out of view, above the screen.
function is_element_out_of_sight(el) {
  let rect = el.getBoundingClientRect()
  let winheight = window.innerHeight || document.documentElement.clientHeight
  return rect.bottom <= rect.height/2          ? -1 :
         rect.top >= winheight - rect.height/2 ? +1 :
                                                  0
}

function hide_el(el) { el.style.visibility = "hidden";  el.style.opacity =   "0%" }
function show_el(el) { el.style.visibility = "visible"; el.style.opacity = "100%" }

function show_hide_buttons() {

  const up_need_show = -1 === is_element_out_of_sight(Q("#helptoggle ~ label"))
  const dn_need_show = +1 === is_element_out_of_sight(el_sura_beg)

  // true if ok is enabled and not overlapping or above suar/ayat-input.
  const ok_need_show =
    !el_ok.disabled &&
    el_ok.getBoundingClientRect().top >= el_qaris.getBoundingClientRect().bottom

  up_need_show? show_el(el_up) : hide_el(el_up)
  dn_need_show? show_el(el_dn) : hide_el(el_dn)
  ok_need_show? show_el(el_ok) : hide_el(el_ok)
}

addEventListener('DOMContentLoaded', show_hide_buttons, false)
addEventListener('load',             show_hide_buttons, false)
addEventListener('scroll',           show_hide_buttons, false)
addEventListener('resize',           show_hide_buttons, false)

// show_hide_buttons() is called to update #ok's visibility
function disable_ok() { el_ok.disabled = true;  show_hide_buttons() }
function enable_ok()  { el_ok.disabled = false; show_hide_buttons(); el_repeat.hidden = true }

// smoothly scroll up to the suar-ayat selection (showing helptoggle)
function scroll_to_select() { Qid("justbeforetoggle").scrollIntoView({block: "start"}) }
// smoothly scroll down to the help toggle button (showing ayatselect)
function scroll_to_toggle() { Qid("justafterselect").scrollIntoView({block: "end"}) }

function init_recitation(qari) {
  audio_base_url = qari !== ""? `http://www.everyayah.com/data/${qari}/` : undefined
  audio_base_url? show_el(el_player) : hide_el(el_player)
}
function play_recitation() {
  if (!audio_base_url) return
  el_player.src = audio_base_url + ayat_recitations_list[current_audio_index] + ".mp3"
  el_player.play()
}
function fetch_recitation() {  // https://stackoverflow.com/a/31351186
  if (!audio_base_url) return
  if (current_audio_index >= ayat_recitations_list.length) return
  let aud = new Audio()
  aud.src = audio_base_url + ayat_recitations_list[current_audio_index] + ".mp3"
}

const spinner = '<center><svg style="height:2em;vertical-align:bottom" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle id="spinner" cx="50" cy="50" r="35" fill="none" stroke-width="10px" stroke="black" stroke-dasharray="40 30"/></svg></center>'
// U+1F389 Party Popper, from NotoColorEmoji; https://github.com/googlefonts/noto-emoji/blob/master/svg/emoji_u1f389.svg
const party = '<<!!cat webres/party-popper.svg | tr -d "\n">>'
const endmsg = `<div id="endmsg">بارك الله فيك وفتح عليك!<br>لقد أتممت التسميع الذي حددته. ${party}</div>`
const suar_lengths = [7,286,200,176,120,165,206,75,129,109,123,111,43,52,99,128,111,110,98,135,112,78,118,64,77,227,93,88,69,60,34,30,73,54,45,83,182,88,75,85,54,53,89,59,37,35,38,29,18,45,60,49,62,55,78,96,29,22,24,13,14,11,11,18,12,12,30,52,52,44,28,28,20,56,40,31,50,40,46,42,29,19,36,25,22,17,19,26,30,20,15,21,11,8,8,19,5,8,8,11,11,8,3,9,5,4,7,3,6,3,5,4,5,6]
const ayat = [<<!!cat webres/othmani-array-tajweed | tr -d '\n' >>]

const basmala = ayat[0].replace(/\xa0.*/, '').replace(/ /g, '\xa0')  //"\ufdfd"

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

// check (and possibly update) suar/ayat-inputs
// return true if the input is valid
function validate_inputs(ev) {

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
  // if the changed field is sura_end, make aaya_end the last aya,
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

function start_reciting(ev) {

  el_repeat.hidden = true
  current_audio_index = 0

  el_aaya_beg.value = filter_aaya_input(el_aaya_beg.value)
  el_aaya_end.value = filter_aaya_input(el_aaya_end.value)
  el_txt.innerHTML = "" //spinner

  if (!validate_inputs(ev)) {
    disable_ok()
    return
  }

  // if page was reloaded and #qaris retained its value, but oninput was not triggered
  init_recitation(el_qaris.value)

  let sura_beg = el_sura_beg.value
  let sura_end = el_sura_end.value
  let aaya_beg = defilter_aaya_input(el_aaya_beg.value)
  let aaya_end = defilter_aaya_input(el_aaya_end.value)

  let st = +suar_lengths.slice(0, sura_beg).reduce((a,b)=>a+b, 0) + +aaya_beg
  let en = +suar_lengths.slice(0, sura_end).reduce((a,b)=>a+b, 0) + +aaya_end
  if (en <= st-1) { disable_ok(); return }  // should not happen!
  enable_ok()

  // prepare ayat_recitations_list,
  // which needs ayat ref in the form "%03d%03d" % (sura_num, aaya_num)
  ayat_recitations_list =
      [...Array(115).keys()].slice(+sura_beg + 1, +sura_end + 2)
          // s is the sura number, 1-based
          .map(s => [...Array(+suar_lengths[s-1] + 1).keys()]
              .slice(s === +sura_beg + 1? +aaya_beg     :   1,
                     s === +sura_end + 1? +aaya_end + 1 : 300  // larger than any sura
              )
              .map(a => s.toString().padStart(3,'0')
                      + a.toString().padStart(3,'0')
              )
          )
  ayat_recitations_list.forEach(s => {  // add basmala
      if (s[0].match(/001$/) && !s[0].match(/^001/) && !s[0].match(/^009/))
        s.unshift("001001")
  })
  ayat_recitations_list = [].concat.apply([], ayat_recitations_list)  // flatten

  // all spaces are a single space in html;
  // let's make tab ('\t') separates the words,
  // and newline (actually '<br>\n') separates the ayat.

  let words = ayat
              .slice(st-1,en)
              .reduce((arr,aya) => {  // https://stackoverflow.com/a/38528645
                  if (aya.startsWith('#')) {
                    arr.push(basmala)
                    aya = aya.replace('#', '')
                  }
                  arr.push(aya)
                  return arr
                }, [])
              .map(a => tajweed_colorize_aaya(a))
              .map(a => a.replace(/ /g, "\t<SPC>") + "<br>\n")
              .map(a => a.replace(/_/g, " "))  // for tajweed
              .map(a => a.split("<SPC>", -1))
  words = [].concat.apply([], words)  // flatten

  let done = false

  // both word_fwd & word_bck return the kind_of_portion, which is:
  //   'a' on aaya boundary
  //   'j' on waqf boundary
  //   'w' otherwise

  const kind_of_portion = function (last_two_chars) {
    const last_one_char = last_two_chars.slice(-1)
    return last_one_char  === 'w' ? 'a' :  // start of text
           last_one_char  === '\n'? 'a' :  // end of aaya
           last_two_chars === '\u06DC\t'? 'j' :  // ARABIC SMALL HIGH SEEN
           last_two_chars === '\u06D6\t'? 'j' :  // ARABIC SMALL HIGH LIGATURE SAD WITH LAM WITH ALEF MAKSURA
           last_two_chars === '\u06D7\t'? 'j' :  // ARABIC SMALL HIGH LIGATURE QAF WITH LAM WITH ALEF MAKSURA
           last_two_chars === '\u06D8\t'? 'j' :  // ARABIC SMALL HIGH MEEM INITIAL FORM
           last_two_chars === '\u06DA\t'? 'j' :  // ARABIC SMALL HIGH JEEM
           last_two_chars === '\u06DB\t'? 'j' :  // ARABIC SMALL HIGH THREE DOTS
           ''
  }

  const audio_play_advance = function () {
      play_recitation()
      current_audio_index += 1
      fetch_recitation()
  }

  const fwd = function (kind) {
    let txt = ''
    const isnt_the_kind =
      kind === 'a'? k => k !== 'a' :
      kind === 'j'? k => k !== 'a' && k !== 'j' :
                    k => false
    if (words.length > 0) {
      let new_word_kind = ''
      do {
        let new_word = words.shift()
        txt += new_word
        new_word_kind = kind_of_portion( new_word.slice(-2) )
      } while (isnt_the_kind(new_word_kind))
      if (new_word_kind === 'a') audio_play_advance()
      el_txt.innerHTML += txt
      scroll_to_bottom()
    }
    else {
      if (!done && el_txt.innerHTML.length > 0) {
        el_txt.innerHTML += endmsg
        done = true
        disable_ok()
        el_repeat.hidden = false
        el_repeat.focus()
       	confetti.start(1200, 50, 150)
      }
      scroll_to_bottom()
    }
  }

  const word_fwd = () => fwd('w')
  const aaya_fwd = () => fwd('a')
  const jmla_fwd = () => fwd('j')

  const word_bck = function (ev) {
    if (el_txt.innerHTML.length === 0) return 'a'
    const last_word = el_txt.innerHTML.match(/(?:^|\t|<br>\n)([^\n\t]+(?:\t|<br>\n))$/)[1]
    words.unshift(last_word)
    el_txt.innerHTML = el_txt.innerHTML.substring(0, el_txt.innerHTML.length - last_word.length)
    if (last_word.match(/<br>\n$/)) {
      current_audio_index -= 1
    }
    return kind_of_portion( el_txt.innerHTML.slice(-2) )
  }

  const aaya_bck = function (ev) {
    do { var c = word_bck() } while (c !== 'a')
  }

  const jmla_bck = function (ev) {
    do { var c = word_bck() } while (c !== 'a' && c !== 'j')
  }

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
      if (ev.target.id === "aaya_end")
        word_fwd()
      return
    }
    // Enter on style inputs: set focus on ok, and get the next word
    if (ev.key === "Enter" && (
          ev.target.id == "ayatnum_input" ||
          ev.target.id == "textclr_input"
    )) {
      el_ok.focus()
      word_fwd()
      return
    }


    // Up or Down on an ayat-input, increase or decrease it
    if (on_ayat) {
      let el = Qid(ev.target.id)
      if (ev.key === "ArrowUp")   el.value = 1 + +defilter_aaya_input(el.value)
      if (ev.key === "ArrowDown") el.value = 1 - +defilter_aaya_input(el.value)
      start_reciting(el)  // handles the filtering
      return
    }

    const kb_mod = ev.shiftKey || ev.ctrlKey || ev.altKey
    const kb_fwd = ev.key === " " || ev.key === "Enter" || ev.key === "ArrowLeft"
    const kb_bck = ev.key === "Backspace" || ev.key === "ArrowRight"
    const not_on_input_field =  // not just ayat and suar
      ev.target.nodeName != "INPUT" && ev.target.nodeName != "SELECT"

    // Enter or Space, and the target is not input or select, get the next word
    // (ie, on the #ok button, or in the page with no element focused)
    // or mouse-click on the ok button

    if (ev.type === "mouseup" && ev.target.id === "ok") { word_fwd(); return }
    if (kb_fwd && !kb_mod && not_on_input_field)        { word_fwd(); return }
    if (kb_bck && !kb_mod && not_on_input_field)        { word_bck(); return }

    if (kb_fwd && kb_mod && not_on_input_field) { aaya_fwd(); return }
    if (kb_bck && kb_mod && not_on_input_field) { aaya_bck(); return }

    if (ev.key === "0" && not_on_input_field) { jmla_fwd(); return }
    if (ev.key === "1" && not_on_input_field) { jmla_bck(); return }

  }

  // both events are the "up" variants to disable repeating (holding down
  // the key, even for a few additional milliseconds by accident), which
  // prints a lot of words
  document.onkeyup = input_trigger
  el_ok.onmouseup = input_trigger
}

function sync_class_with(cls, pred) {
  pred? Q("body").classList.add(cls) : Q("body").classList.remove(cls)
}

function chstyle() {
  const tval = Qid("textclr_input").value
  sync_class_with("letter-parts",   tval === "bas")
  sync_class_with("letter-nocolor", tval === "no")
  //
  sync_class_with("ayat-nocolor", !Qid("ayatnum_input").checked)
  //
  sync_class_with("dark", Qid("darkmode_input").checked)
}

el_repeat.onmouseup = start_reciting
el_repeat.onclick   = start_reciting

onload = function() {
  el_sura_beg.value = ""
  el_aaya_beg.value = ""
  el_sura_end.value = ""
  el_aaya_end.value = ""
  chstyle()  // to update the style, as we don't reset these
             // inputs, so they keep their values on refresh.
  let xyz = Qid("xyz")
  let mia_nomo = Q("body").innerHTML.match(/github[.]com\/([a-z0-9]+)\//)[1]
  xyz.innerHTML = mia_nomo + "_".charCodeAt(0) + String.fromCharCode(1<<6) + "moc.liamg".split("").reverse().join("")
  xyz.href = xyz.innerHTML.slice(13,17) + "to" + String.fromCharCode("xyz".charCodeAt(1<<1)^0100) + xyz.innerHTML
  // if you know a better way, please let me know!
  disable_ok()
}
// vim: set sw=2 ts=2 et colorcolumn=80:
