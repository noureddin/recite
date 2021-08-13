// I know that the JS naming convention is to use lowerCamelCase for variables
// and functions. But I decided to use snake_case exclusively to make my
// functions visually distinct from those of JS, especially b/c I have functions
// with similar names, eg scroll_to_top. I also use it for variables and consts.
// The only exception is the following two shorthand functions.

const say = console.log

// Q, Qid, el_*, data {{{
function Q (selector) { return document.querySelector(selector) }
function Qid (id)     { return document.getElementById(id) }

<<!!bash -c 'for id in {sura,aaya}_{bgn,end} qaris player title txt txt_txt quizmode endmsg ok new repeat selectors header end_of_header zzback zzignore mvbtns_disablehack mvbtns {next,prev}{word,jmla,aaya}; do echo "const el_$id = Qid(\"$id\")"; done'>>

const suar_length = [7,286,200,176,120,165,206,75,129,109,123,111,43,52,99,128,111,110,98,135,112,78,118,64,77,227,93,88,69,60,34,30,73,54,45,83,182,88,75,85,54,53,89,59,37,35,38,29,18,45,60,49,62,55,78,96,29,22,24,13,14,11,11,18,12,12,30,52,52,44,28,28,20,56,40,31,50,40,46,42,29,19,36,25,22,17,19,26,30,20,15,21,11,8,8,19,5,8,8,11,11,8,3,9,5,4,7,3,6,3,5,4,5,6]
const suar_name = [<<!!sed "s/^/'/;s/$/',/" res/suar-names | tr -d '\n' >>]
// both rubs and pages are based on http://tanzil.net/res/text/metadata/quran-data.js
// but changed from sura-aya pairs to aya indexes (0-6235)
const rubs = [0,32,50,66,81,98,112,130,148,164,183,195,209,225,239,249,259,269,278,289,307,325,344,367,385,405,425,445,463,478,493,504,516,528,550,566,580,592,606,627,640,655,669,680,695,709,719,735,750,765,777,801,824,847,862,883,899,915,929,939,954,984,1000,1018,1041,1070,1095,1109,1124,1142,1160,1181,1200,1220,1235,1253,1268,1280,1294,1309,1327,1345,1356,1374,1389,1416,1434,1453,1478,1496,1513,1533,1556,1580,1602,1625,1648,1672,1696,1711,1725,1741,1759,1777,1802,1851,1901,1930,1951,1975,1990,2011,2029,2051,2078,2098,2127,2156,2171,2190,2214,2238,2271,2308,2348,2402,2430,2458,2483,2511,2533,2565,2595,2613,2632,2654,2673,2708,2747,2791,2811,2825,2843,2855,2875,2907,2932,2983,3042,3112,3159,3185,3214,3240,3263,3280,3302,3327,3340,3365,3385,3409,3439,3462,3490,3513,3533,3550,3563,3583,3592,3615,3629,3651,3674,3700,3732,3764,3809,3870,3932,3990,4021,4065,4089,4110,4133,4153,4173,4198,4226,4242,4264,4284,4298,4322,4348,4381,4430,4484,4510,4530,4554,4577,4600,4612,4625,4656,4705,4758,4809,4854,4901,4979,5053,5090,5104,5117,5136,5156,5177,5191,5217,5229,5241,5271,5323,5393,5447,5494,5551,5609,5672,5758,5829,5884,5948,6023,6090,6154,6236]
const pages = [0,7,12,23,31,36,44,55,64,68,76,83,90,95,100,108,112,119,126,133,141,148,152,160,170,176,183,188,193,197,203,209,217,222,226,231,237,240,244,252,255,259,263,266,271,276,281,288,289,293,302,308,315,322,330,338,345,354,363,370,376,384,393,401,408,414,425,433,441,446,450,458,466,473,479,487,493,499,504,507,512,516,519,526,530,537,544,552,558,567,572,579,584,587,594,598,606,614,620,627,633,640,647,655,663,668,671,674,678,682,686,692,700,705,710,714,719,726,733,739,745,751,758,764,772,777,782,789,797,807,816,824,833,841,848,857,862,870,879,883,890,899,907,913,920,926,931,935,940,946,954,965,976,984,991,997,1005,1011,1021,1027,1035,1041,1049,1058,1074,1084,1091,1097,1103,1109,1113,1117,1124,1132,1141,1149,1160,1168,1176,1185,1193,1200,1205,1212,1221,1229,1235,1241,1248,1255,1261,1266,1271,1275,1282,1289,1296,1303,1307,1314,1321,1328,1334,1341,1346,1352,1357,1364,1370,1378,1384,1389,1397,1406,1417,1425,1434,1442,1452,1461,1470,1478,1485,1492,1501,1510,1518,1526,1535,1544,1554,1561,1570,1581,1590,1600,1610,1618,1626,1633,1639,1648,1659,1665,1674,1682,1691,1699,1707,1712,1720,1725,1735,1741,1749,1755,1760,1768,1774,1783,1792,1802,1817,1833,1853,1872,1892,1907,1915,1927,1935,1943,1955,1965,1973,1980,1988,1994,2003,2011,2019,2029,2036,2046,2056,2067,2078,2087,2095,2104,2115,2125,2133,2144,2155,2160,2167,2174,2185,2193,2201,2214,2223,2237,2250,2261,2275,2288,2301,2314,2326,2345,2360,2385,2399,2412,2424,2435,2446,2461,2473,2483,2493,2507,2518,2527,2540,2555,2564,2573,2584,2595,2600,2610,2618,2625,2633,2641,2650,2659,2667,2673,2690,2700,2715,2732,2747,2762,2777,2791,2801,2811,2818,2822,2827,2834,2844,2849,2852,2857,2866,2875,2887,2898,2910,2922,2932,2951,2971,2992,3015,3043,3068,3091,3115,3138,3159,3172,3181,3194,3203,3214,3222,3235,3247,3257,3265,3273,3280,3287,3295,3302,3311,3322,3329,3336,3346,3354,3363,3370,3378,3385,3392,3403,3414,3424,3433,3441,3450,3459,3469,3480,3488,3497,3503,3514,3523,3533,3539,3548,3555,3563,3568,3576,3583,3587,3595,3606,3613,3620,3628,3637,3645,3654,3663,3671,3678,3690,3698,3704,3717,3732,3745,3759,3775,3788,3812,3839,3864,3890,3914,3941,3970,3986,3996,4012,4031,4053,4063,4068,4079,4089,4098,4105,4114,4125,4132,4140,4149,4158,4166,4173,4182,4191,4199,4210,4218,4229,4238,4247,4256,4264,4272,4282,4287,4294,4303,4316,4323,4335,4347,4358,4372,4385,4398,4414,4432,4453,4473,4486,4495,4505,4515,4524,4530,4538,4545,4556,4564,4574,4583,4592,4598,4606,4611,4616,4623,4630,4645,4665,4681,4705,4726,4749,4766,4784,4810,4828,4852,4873,4895,4917,4941,4968,4995,5029,5055,5078,5086,5093,5099,5104,5110,5115,5125,5129,5135,5142,5150,5155,5161,5168,5177,5185,5192,5199,5208,5217,5222,5229,5236,5241,5253,5267,5286,5313,5331,5357,5385,5414,5429,5447,5460,5475,5494,5512,5542,5570,5596,5616,5641,5672,5702,5727,5758,5800,5829,5854,5882,5909,5931,5963,5993,6016,6043,6072,6098,6125,6137,6155,6176,6193,6207,6221,6236]
// from tanzil metadata too, but in a more compact format
const rukus = [[1],[1,8,21,30,40,47,60,62,72,83,87,97,104,113,122,130,142,148,153,164,168,177,183,189,197,211,217,222,229,232,236,243,249,254,258,261,267,274,282,284],[1,10,21,31,42,55,64,72,81,92,102,110,121,130,144,149,156,172,181,190],[1,11,15,23,26,34,43,51,60,71,77,88,92,97,101,105,113,116,127,135,142,153,163,172],[1,6,12,20,27,35,44,51,57,67,78,87,94,101,109,116],[1,11,21,31,42,51,56,61,71,83,91,95,101,111,122,130,141,145,151,155],[1,11,26,32,40,48,54,59,65,73,85,94,100,109,127,130,142,148,152,158,163,172,182,189],[1,11,20,29,38,45,49,59,65,70],[1,7,17,25,30,38,43,60,67,73,81,90,100,111,119,123],[1,11,21,31,41,54,61,71,83,93,104],[1,9,25,36,50,61,69,84,96,110],[1,7,21,30,36,43,50,58,69,80,94,105],[1,8,19,27,32,38],[1,7,13,22,28,35,42],[1,16,26,45,61,80],[1,10,22,26,35,41,51,61,66,71,77,84,90,101,111,120],[1,11,23,31,41,53,61,71,78,85,94,101],[1,13,18,23,32,45,50,54,60,71,83,102],[1,16,41,51,66,83],[1,25,55,77,90,105,116,129],[1,11,30,42,51,76,94],[1,11,23,26,34,39,49,58,65,73],[1,23,33,51,78,93],[1,11,21,27,35,41,51,58,62],[1,10,21,35,45,61],[1,10,34,53,70,105,123,141,160,176,192],[1,15,32,45,59,67,83],[1,14,22,29,43,51,61,76],[1,14,23,31,45,52,64],[1,11,20,28,41,54],[1,12,20],[1,12,23],[1,9,21,28,35,41,53,59,69],[1,10,22,31,37,46],[1,8,15,27,38],[1,13,33,51,68],[1,22,75,114,139],[1,15,27,41,65],[1,10,22,32,42,53,64,71],[1,10,21,28,38,51,61,69,79],[1,9,19,26,33,45],[1,10,20,30,44],[1,16,26,36,46,57,68],[1,30,43],[1,12,22,27],[1,11,21,27],[1,12,20,29],[1,11,18,27],[1,11],[1,16,30],[1,24,47],[1,29],[1,26,33],[1,23,41],[1,26,46],[1,39,75],[1,11,20,26],[1,7,14],[1,11,18],[1,7],[1,10],[1,9],[1,9],[1,11],[1,8],[1,8],[1,15],[1,34],[1,38],[1,36],[1,21],[1,20],[1,20],[1,32],[1,31],[1,23],[1,41],[1,31],[1,27],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1]]

function start_ (s) { return +suar_length.slice(0, s).reduce((a, b) => a + b, 0) }

// TODO see: https://stackoverflow.com/q/10726638

function filter_aaya_input (n) {  // remove non-numerals and convert numerals to Eastern Arabic
  return n.toString()
      .replace(/[0٠]/g, '٠')
      .replace(/[1١]/g, '١')
      .replace(/[2٢]/g, '٢')
      .replace(/[3٣]/g, '٣')
      .replace(/[4٤]/g, '٤')
      .replace(/[5٥]/g, '٥')
      .replace(/[6٦]/g, '٦')
      .replace(/[7٧]/g, '٧')
      .replace(/[8٨]/g, '٨')
      .replace(/[9٩]/g, '٩')
      .replace(/[^٠١٢٣٤٥٦٧٨٩]/g, '')
}
function defilter_aaya_input (n) {  // convert numerals to ASCII
  return n
      .replace(/٠/g, '0')
      .replace(/١/g, '1')
      .replace(/٢/g, '2')
      .replace(/٣/g, '3')
      .replace(/٤/g, '4')
      .replace(/٥/g, '5')
      .replace(/٦/g, '6')
      .replace(/٧/g, '7')
      .replace(/٨/g, '8')
      .replace(/٩/g, '9')
}

const sura_bgn_length = () => el_sura_bgn.value === ''? 0  :         suar_length[+el_sura_bgn.value]
const sura_end_length = () => el_sura_end.value === ''? 0  :         suar_length[+el_sura_end.value]
const sura_bgn_val    = () => el_sura_bgn.value === ''? '' :                     +el_sura_bgn.value
const sura_end_val    = () => el_sura_end.value === ''? '' :                     +el_sura_end.value
const aaya_bgn_val    = () => el_aaya_bgn.value === ''? '' : +defilter_aaya_input(el_aaya_bgn.value)
const aaya_end_val    = () => el_aaya_end.value === ''? '' : +defilter_aaya_input(el_aaya_end.value)


// }}}

// validate_aaya_sura_input {{{
// called oninput and onblur with the element; only called for {sura,aaya}_{bgn,end} inputs.
// sometimes updates the input fields. and enables #ok if the inputs are valid.
function validate_aaya_sura_input (ev) {
  const el = ev.target
  const blur = ev.type === 'blur'
  const is_aaya = el === el_aaya_bgn || el === el_aaya_end

  el_aaya_bgn.value = filter_aaya_input(el_aaya_bgn.value)
  el_aaya_end.value = filter_aaya_input(el_aaya_end.value)

  if (blur && is_aaya && el.value === '') {
    if (el === el_aaya_bgn) {
      if (el_sura_bgn.value !== '') { el.value = 0 }
    }
    else {  // el === el_aaya_end
      if (el_sura_end.value !== '') { el.value = 300 }
    }
  }

  const set_aaya_bgn = (n) => el_aaya_bgn.value = filter_aaya_input(+n)
  const set_aaya_end = (n) => el_aaya_end.value = filter_aaya_input(+n)

  // if the changed field is sura_bgn, make aaya_bgn 1 if empty,
  // and update sura_end if empty or is before sura_bgn
  if (!blur && el === el_sura_bgn) {
    if (aaya_bgn_val() === '') { set_aaya_bgn(1) }
    if (sura_end_val() === '' || sura_end_val() < sura_bgn_val()) {
      el_sura_end.value = sura_bgn_val()
      set_aaya_end(sura_end_length())
    }
  }
  // if the changed field is sura_end, make aaya_end the last aya,
  // and update sura_bgn if empty or is after sura_end
  else if (!blur && el === el_sura_end) {
    set_aaya_end(sura_end_length())
    if (sura_bgn_val() === '' || (sura_end_val() !== '' && sura_end_val() < sura_bgn_val())) {
      el_sura_bgn.value = sura_end_val()
      set_aaya_bgn(1)
    }
  }

  // make sure ayat are within limits:

  // ayat upper-limits:
  if (aaya_bgn_val() > sura_bgn_length()) { set_aaya_bgn(sura_bgn_length()) }
  if (aaya_end_val() > sura_end_length()) { set_aaya_end(sura_end_length()) }

  // ayat lower-limits:
  if (aaya_bgn_val() === 0) { set_aaya_bgn(1) }
  if (aaya_end_val() === 0) { set_aaya_end(1) }
  // '' is checked for in the onblur case above
  // a negative sign is not allowed to be entered

  if (sura_bgn_val() !== '' && sura_end_val() !== '' &&
      aaya_bgn_val() !== '' && aaya_end_val() !== ''
  ) {
    // console.log('valid', sura_bgn_val(), sura_end_val(), aaya_bgn_val(), aaya_end_val())
    el_ok.disabled = false
  }
  else {
    // console.log('invalid')
    el_ok.disabled = true
  }
}
// }}}

// from: https://github.com/mathusummut/confetti.js
// Copyright (c) 2018 MathuSum Mut. MIT License
<<!!cat res/confetti.min.js>>

<<!!cat res/jszip-utils.min.js>>

// based on https://stackoverflow.com/a/7557433
// return:
//    0 if at least half the element's height is in viewport;
//   +1 if at least half the element's height is out of view, under the screen;
//   -1 if at least half the element's height is out of view, above the screen.
function is_element_out_of_sight (el) {
  let rect = el.getBoundingClientRect()
  let winheight = window.innerHeight || document.documentElement.clientHeight
  return rect.bottom <= rect.height/2          ? -1 :
         rect.top >= winheight - rect.height/2 ? +1 :
                                                  0
}

const audio = (function () {  // {{{
  const el_player = Qid('player')
  let list
  let base_url
  let cur_idx

  function invalid_state () {
    return cur_idx == null || !base_url || !list || cur_idx >= list.length
  }

  function cur_url () {
    if (invalid_state()) { return }
    return base_url + list[cur_idx] + '.mp3'
  }

  function fetch () {  // https://stackoverflow.com/a/31351186
    if (invalid_state()) { return }
    (new Audio()).src = cur_url()
  }

  function play () {
    if (invalid_state()) { return }
    el_player.src = cur_url()
    el_player.play()
  }

  function advance  () { cur_idx += 1; fetch() }
  function init_idx () { cur_idx = 0;  fetch() }
  function set_idx  (i){ cur_idx = i;  fetch() }
  function back     () { if (cur_idx >= 1) { cur_idx -= 1 } }

  function show_or_hide_player () {
    invalid_state() ? hide_el(el_player) : show_el(el_player)
  }

  function update_qari (qari) {
    base_url = qari === '' ? undefined : `https://www.everyayah.com/data/${qari}/`
    fetch()
  }

  return {

    update_qari: function (qari) {
      update_qari(qari)
      show_or_hide_player()
    },

    init: function (qari) {
      update_qari(qari)
      init_idx()
    },

    fill: function (ayat) {
      list = ayat
      init_idx()
      show_or_hide_player()
    },

    play_next: function () {
      if (invalid_state()) { return }
      play()
      advance()
    },

    back: function () {
      back()
    },

    play_index: function (i) {
      if (invalid_state()) { return }
      set_idx(i)
      show_or_hide_player()
      play()
      advance()
    },

  }
})()

// }}}

// kind_of_portion is: 'a' on aaya boundary; 'j' on waqf boundary; '' otherwise. {{{
function kind_of_portion (last_two_chars) {
  const last_one_char = last_two_chars.slice(-1)
  return last_one_char  === ''  ? 'a' :  // start of text
         last_one_char  === '\n'? 'a' :  // end of aaya
         last_two_chars === '\u06DC\t'? 'j' :  // ARABIC SMALL HIGH SEEN
         last_two_chars === '\u06D6\t'? 'j' :  // ARABIC SMALL HIGH LIGATURE SAD WITH LAM WITH ALEF MAKSURA
         last_two_chars === '\u06D7\t'? 'j' :  // ARABIC SMALL HIGH LIGATURE QAF WITH LAM WITH ALEF MAKSURA
         last_two_chars === '\u06D8\t'? 'j' :  // ARABIC SMALL HIGH MEEM INITIAL FORM
         last_two_chars === '\u06DA\t'? 'j' :  // ARABIC SMALL HIGH JEEM
         last_two_chars === '\u06DB\t'? 'j' :  // ARABIC SMALL HIGH THREE DOTS
         ''
}  // }}}

function valid_inputs (sura_bgn, aaya_bgn, sura_end, aaya_end) {  // {{{
  return (
    sura_bgn !== '' && aaya_bgn !== '' &&
    sura_end !== '' && aaya_end !== '' &&
    sura_bgn <= sura_end &&
    (aaya_bgn <= aaya_end || sura_bgn < sura_end) &&
    1 <= aaya_bgn && aaya_bgn <= suar_length[sura_bgn] &&
    1 <= aaya_end && aaya_end <= suar_length[sura_end]
  )
}  // }}}

function chquizmode () {
  if (!el_zzignore.hidden) { parent.zz_set_quizmode(el_quizmode.value) }
}

function chstyle () {
  const sync_class_with = (cls, pred) =>
    pred ? Q('body').classList.add(cls) : Q('body').classList.remove(cls)
  //
  const tval = Qid('textclr_input').value
  sync_class_with('letter-parts',   tval === 'bas')
  sync_class_with('letter-nocolor', tval === 'no')
  if (!el_zzignore.hidden) { parent.zz_set_tajweed(tval.slice(0,1)) }
  //
  sync_class_with('ayat-nocolor', !Qid('ayatnum_input').checked)
  //
  // sync_class_with('dark', Qid('darkmode_input').checked)
  let dark = Qid('dark').checked = Qid('darkmode_input').checked
  if (!el_zzignore.hidden) { parent.zz_set_dark(dark) }
  // mvbtns
  const mv = Qid('mvbtns_input').value
  const mv_cls =
    mv === 'right' ? 'sidebtns rightside' :
    mv === 'left'  ? 'sidebtns leftside'  :
                     ''  /* no class for 'bottom' */
  el_mvbtns.setAttribute('class', mv_cls)
  if (!el_zzignore.hidden) { parent.zz_set_mvbtns(mv.slice(0,1)) }
}

function decode_contact () {
  let xyz = Qid('xyz')
  let mia_nomo = Q('body').innerHTML.match(/github[.]com\/([a-z0-9]+)\//)[1]
  xyz.innerHTML = mia_nomo + '_'.charCodeAt(0) + String.fromCharCode(1<<6) + 'moc.liamg'.split('').reverse().join('')
  xyz.href = xyz.innerHTML.slice(13,17) + 'to' + String.fromCharCode('xyz'.charCodeAt(1<<1)^0O100) + xyz.innerHTML
  // if you know a better way, please let me know!
}

function make_title (sura_bgn, aaya_bgn, sura_end, aaya_end) {

  //// the longest strings (some are impossible):
  // return ["تسميع الآية الأخيرة من سورة العنكبوت", 'oneaaya']
  // return ["تسميع سورة العنكبوت كاملة", 'onesura']
  // return ["تسميع سورة العنكبوت من الآية الأخيرة حتى الآية الأخيرة", 'manyaaya']
  // return ["تسميع سورتي العنكبوت والعنكبوت كاملتين", 'twosura']
  // return ["تسميع السور من العنكبوت حتى العنكبوت", 'manysura']
  // return ["تسميع من سورة العنكبوت الآية الأخيرة حتى سورة العنكبوت الآية الأخيرة", 'manymany']

  const nbsp = '\xa0'
  // all numbers are 1-based
  sura_bgn = +sura_bgn
  aaya_bgn = +aaya_bgn
  sura_end = +sura_end
  aaya_end = +aaya_end
  const s_bgn_len = suar_length[sura_bgn - 1]
  const s_end_len = suar_length[sura_end - 1]
  const s_bgn_txt = suar_name[sura_bgn - 1]
  const s_end_txt = suar_name[sura_end - 1]
  // converts to Eastern Arabic numerals, and state the first and last in words
  const a_bgn_txt = aaya_bgn === 1? 'الأولى' : aaya_bgn === s_bgn_len? 'الأخيرة' : filter_aaya_input(aaya_bgn)
  const a_end_txt = aaya_end === 1? 'الأولى' : aaya_end === s_end_len? 'الأخيرة' : filter_aaya_input(aaya_end)
  //
  if (sura_bgn === sura_end) {
    // if exactly one aaya
    if (aaya_bgn === aaya_end) {
      return [`تسميع الآية${nbsp}${a_bgn_txt} من${nbsp}سورة${nbsp}${s_bgn_txt}`, '']
    }
    // if one complete sura
    if (aaya_bgn === 1 && aaya_end === s_end_len) {
      return [`تسميع سورة ${s_bgn_txt} كاملة`, '']
    }
    // otherwise: one partial sura
    return [`تسميع سورة${nbsp}${s_bgn_txt} من${nbsp}الآية${nbsp}${a_bgn_txt} حتى${nbsp}الآية${nbsp}${a_end_txt}`, '']
  }
  // more than one sura:
  // if multiple complete suar
  if (aaya_bgn === 1 && aaya_end === s_end_len) {
    // if exactly two
    if (sura_end === sura_bgn + 1) {
      return [`تسميع سورتي ${s_bgn_txt} و${s_end_txt} كاملتين`, '']
    }
    // otherwise: more than two (one is handled previously)
    return [`تسميع السور من${nbsp}${s_bgn_txt} حتى${nbsp}${s_end_txt}`, '']
  }
  // otherwise
  return [`تسميع من${nbsp}سورة${nbsp}${s_bgn_txt} الآية${nbsp}${a_bgn_txt} حتى${nbsp}سورة${nbsp}${s_end_txt} الآية${nbsp}${a_end_txt}`, 'manymany']
}

// vim: set sw=2 ts=2 et fdm=marker colorcolumn=80:
