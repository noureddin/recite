<<!!cat a.js>>
// I know that the JS naming convention is to use lowerCamelCase for variables
// and functions. But I decided to use snake_case exclusively to make my
// functions visually distinct from those of JS, especially b/c I have functions
// with similar names, eg scroll_to_top. I also use it for variables and consts.
// The only exception is the following two shorthand functions.

// {{{
function Q (selector) { return document.querySelector(selector) }
function Qid (id)     { return document.getElementById(id) }

const say = console.log

<<!!bash -c 'for id in {sura,aaya}_{bgn,end} qaris player txt endmsg ok new repeat selectors header nextword up dn; do echo "const el_$id = Qid(\"$id\")"; done'>>

const suar_length = [7,286,200,176,120,165,206,75,129,109,123,111,43,52,99,128,111,110,98,135,112,78,118,64,77,227,93,88,69,60,34,30,73,54,45,83,182,88,75,85,54,53,89,59,37,35,38,29,18,45,60,49,62,55,78,96,29,22,24,13,14,11,11,18,12,12,30,52,52,44,28,28,20,56,40,31,50,40,46,42,29,19,36,25,22,17,19,26,30,20,15,21,11,8,8,19,5,8,8,11,11,8,3,9,5,4,7,3,6,3,5,4,5,6]
// const suar_name = [<<!!sed "s/^/'/;s/$/',/" res/suar-names | tr -d '\n' >>]
const ayat = [<<!!cat res/othmani-array-tajweed | tr -d '\n' >>]
// both rubs and pages are based on http://tanzil.net/res/text/metadata/quran-data.js
// but changed from sura-aya pairs to aya indexes (0-6235)
const rubs = [0,32,50,66,81,98,112,130,148,164,183,195,209,225,239,249,259,269,278,289,307,325,344,367,385,405,425,445,463,478,493,504,516,528,550,566,580,592,606,627,640,655,669,680,695,709,719,735,750,765,777,801,824,847,862,883,899,915,929,939,954,984,1000,1018,1041,1070,1095,1109,1124,1142,1160,1181,1200,1220,1235,1253,1268,1280,1294,1309,1327,1345,1356,1374,1389,1416,1434,1453,1478,1496,1513,1533,1556,1580,1602,1625,1648,1672,1696,1711,1725,1741,1759,1777,1802,1851,1901,1930,1951,1975,1990,2011,2029,2051,2078,2098,2127,2156,2171,2190,2214,2238,2271,2308,2348,2402,2430,2458,2483,2511,2533,2565,2595,2613,2632,2654,2673,2708,2747,2791,2811,2825,2843,2855,2875,2907,2932,2983,3042,3112,3159,3185,3214,3240,3263,3280,3302,3327,3340,3365,3385,3409,3439,3462,3490,3513,3533,3550,3563,3583,3592,3615,3629,3651,3674,3700,3732,3764,3809,3870,3932,3990,4021,4065,4089,4110,4133,4153,4173,4198,4226,4242,4264,4284,4298,4322,4348,4381,4430,4484,4510,4530,4554,4577,4600,4612,4625,4656,4705,4758,4809,4854,4901,4979,5053,5090,5104,5117,5136,5156,5177,5191,5217,5229,5241,5271,5323,5393,5447,5494,5551,5609,5672,5758,5829,5884,5948,6023,6090,6154,6236]
const pages = [0,7,12,23,31,36,44,55,64,68,76,83,90,95,100,108,112,119,126,133,141,148,152,160,170,176,183,188,193,197,203,209,217,222,226,231,237,240,244,252,255,259,263,266,271,276,281,288,289,293,302,308,315,322,330,338,345,354,363,370,376,384,393,401,408,414,425,433,441,446,450,458,466,473,479,487,493,499,504,507,512,516,519,526,530,537,544,552,558,567,572,579,584,587,594,598,606,614,620,627,633,640,647,655,663,668,671,674,678,682,686,692,700,705,710,714,719,726,733,739,745,751,758,764,772,777,782,789,797,807,816,824,833,841,848,857,862,870,879,883,890,899,907,913,920,926,931,935,940,946,954,965,976,984,991,997,1005,1011,1021,1027,1035,1041,1049,1058,1074,1084,1091,1097,1103,1109,1113,1117,1124,1132,1141,1149,1160,1168,1176,1185,1193,1200,1205,1212,1221,1229,1235,1241,1248,1255,1261,1266,1271,1275,1282,1289,1296,1303,1307,1314,1321,1328,1334,1341,1346,1352,1357,1364,1370,1378,1384,1389,1397,1406,1417,1425,1434,1442,1452,1461,1470,1478,1485,1492,1501,1510,1518,1526,1535,1544,1554,1561,1570,1581,1590,1600,1610,1618,1626,1633,1639,1648,1659,1665,1674,1682,1691,1699,1707,1712,1720,1725,1735,1741,1749,1755,1760,1768,1774,1783,1792,1802,1817,1833,1853,1872,1892,1907,1915,1927,1935,1943,1955,1965,1973,1980,1988,1994,2003,2011,2019,2029,2036,2046,2056,2067,2078,2087,2095,2104,2115,2125,2133,2144,2155,2160,2167,2174,2185,2193,2201,2214,2223,2237,2250,2261,2275,2288,2301,2314,2326,2345,2360,2385,2399,2412,2424,2435,2446,2461,2473,2483,2493,2507,2518,2527,2540,2555,2564,2573,2584,2595,2600,2610,2618,2625,2633,2641,2650,2659,2667,2673,2690,2700,2715,2732,2747,2762,2777,2791,2801,2811,2818,2822,2827,2834,2844,2849,2852,2857,2866,2875,2887,2898,2910,2922,2932,2951,2971,2992,3015,3043,3068,3091,3115,3138,3159,3172,3181,3194,3203,3214,3222,3235,3247,3257,3265,3273,3280,3287,3295,3302,3311,3322,3329,3336,3346,3354,3363,3370,3378,3385,3392,3403,3414,3424,3433,3441,3450,3459,3469,3480,3488,3497,3503,3514,3523,3533,3539,3548,3555,3563,3568,3576,3583,3587,3595,3606,3613,3620,3628,3637,3645,3654,3663,3671,3678,3690,3698,3704,3717,3732,3745,3759,3775,3788,3812,3839,3864,3890,3914,3941,3970,3986,3996,4012,4031,4053,4063,4068,4079,4089,4098,4105,4114,4125,4132,4140,4149,4158,4166,4173,4182,4191,4199,4210,4218,4229,4238,4247,4256,4264,4272,4282,4287,4294,4303,4316,4323,4335,4347,4358,4372,4385,4398,4414,4432,4453,4473,4486,4495,4505,4515,4524,4530,4538,4545,4556,4564,4574,4583,4592,4598,4606,4611,4616,4623,4630,4645,4665,4681,4705,4726,4749,4766,4784,4810,4828,4852,4873,4895,4917,4941,4968,4995,5029,5055,5078,5086,5093,5099,5104,5110,5115,5125,5129,5135,5142,5150,5155,5161,5168,5177,5185,5192,5199,5208,5217,5222,5229,5236,5241,5253,5267,5286,5313,5331,5357,5385,5414,5429,5447,5460,5475,5494,5512,5542,5570,5596,5616,5641,5672,5702,5727,5758,5800,5829,5854,5882,5909,5931,5963,5993,6016,6043,6072,6098,6125,6137,6155,6176,6193,6207,6221,6236]
// from tanzil metadata too, but in a more compact format
const rukus = [[1],[1,8,21,30,40,47,60,62,72,83,87,97,104,113,122,130,142,148,153,164,168,177,183,189,197,211,217,222,229,232,236,243,249,254,258,261,267,274,282,284],[1,10,21,31,42,55,64,72,81,92,102,110,121,130,144,149,156,172,181,190],[1,11,15,23,26,34,43,51,60,71,77,88,92,97,101,105,113,116,127,135,142,153,163,172],[1,6,12,20,27,35,44,51,57,67,78,87,94,101,109,116],[1,11,21,31,42,51,56,61,71,83,91,95,101,111,122,130,141,145,151,155],[1,11,26,32,40,48,54,59,65,73,85,94,100,109,127,130,142,148,152,158,163,172,182,189],[1,11,20,29,38,45,49,59,65,70],[1,7,17,25,30,38,43,60,67,73,81,90,100,111,119,123],[1,11,21,31,41,54,61,71,83,93,104],[1,9,25,36,50,61,69,84,96,110],[1,7,21,30,36,43,50,58,69,80,94,105],[1,8,19,27,32,38],[1,7,13,22,28,35,42],[1,16,26,45,61,80],[1,10,22,26,35,41,51,61,66,71,77,84,90,101,111,120],[1,11,23,31,41,53,61,71,78,85,94,101],[1,13,18,23,32,45,50,54,60,71,83,102],[1,16,41,51,66,83],[1,25,55,77,90,105,116,129],[1,11,30,42,51,76,94],[1,11,23,26,34,39,49,58,65,73],[1,23,33,51,78,93],[1,11,21,27,35,41,51,58,62],[1,10,21,35,45,61],[1,10,34,53,70,105,123,141,160,176,192],[1,15,32,45,59,67,83],[1,14,22,29,43,51,61,76],[1,14,23,31,45,52,64],[1,11,20,28,41,54],[1,12,20],[1,12,23],[1,9,21,28,35,41,53,59,69],[1,10,22,31,37,46],[1,8,15,27,38],[1,13,33,51,68],[1,22,75,114,139],[1,15,27,41,65],[1,10,22,32,42,53,64,71],[1,10,21,28,38,51,61,69,79],[1,9,19,26,33,45],[1,10,20,30,44],[1,16,26,36,46,57,68],[1,30,43],[1,12,22,27],[1,11,21,27],[1,12,20,29],[1,11,18,27],[1,11],[1,16,30],[1,24,47],[1,29],[1,26,33],[1,23,41],[1,26,46],[1,39,75],[1,11,20,26],[1,7,14],[1,11,18],[1,7],[1,10],[1,9],[1,9],[1,11],[1,8],[1,8],[1,15],[1,34],[1,38],[1,36],[1,21],[1,20],[1,20],[1,32],[1,31],[1,23],[1,41],[1,31],[1,27],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1]]

function start_ (s) { return +suar_length.slice(0, s).reduce((a, b) => a + b, 0) }

const basmala = ayat[0].replace(/\xa0.*/, '').replace(/ /g, '\xa0')  // '\ufdfd'

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

// {{{

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

function start_reciting () {
  hide_selectors()
  el_nextword.focus()
  if (!valid_inputs(sura_bgn_val(), aaya_bgn_val(), sura_end_val(), aaya_end_val())) { return }
  const st = start_(sura_bgn_val()) + aaya_bgn_val()
  const en = start_(sura_end_val()) + aaya_end_val()
  recite(st, en, el_qaris.value)
}

function input_trigger_x (ev) {
  // this fn is connected to onkeyup and onmouseup. it handles three "events"

  const on_ayat = ev.target.id === 'aaya_bgn' || ev.target.id === 'aaya_end'
  const on_suar = ev.target.id === 'sura_bgn' || ev.target.id === 'sura_end'

  // Enter on suar/ayat selection: set focus on the next element:
  //   sura_bgn > aaya_bgn > sura_end > aaya_end > ok
  // also, on the last element, get the next (ie first) word
  if (ev.key === 'Enter' && (on_ayat || on_suar)) {
    (ev.target.id === 'sura_bgn'? el_aaya_bgn :
     ev.target.id === 'aaya_bgn'? el_sura_end :
     ev.target.id === 'sura_end'? el_aaya_end :
     ev.target.id === 'aaya_end'? el_ok       :
     1).focus()
    return
  }

  // Up or Down on an ayat-input, increase or decrease it
  if (on_ayat) {
    let el = Qid(ev.target.id)
    if (ev.key === 'ArrowUp')   { el.value = 1 + +defilter_aaya_input(el.value) }
    if (ev.key === 'ArrowDown') { el.value = 1 - +defilter_aaya_input(el.value) }
    validate_aaya_sura_input(ev)  // handles the filtering and the limits
    return
  }
}

// }}}


// from: https://github.com/mathusummut/confetti.js
// Copyright (c) 2018 MathuSum Mut. MIT License
<<!!cat res/confetti.min.js>>

function show_done () {
  if (el_endmsg.hidden && el_txt.innerHTML.length > 0) {
    el_endmsg.hidden = false
    show_selectors()
    confetti.start(1200, 50, 150)
    setTimeout(() => el_ok.focus(), 500)
    // // el_repeat.focus()
    // el_new.focus()
    return true
  }
  return false
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

  }
})()

// }}}

// {{{

function tajweed_colorize_aaya (a) {
  return a.replace(/([A-Z])<([^>]+)>/g, '<span_class="$1">$2</span>')
}


function help_toggled ()   { setTimeout(scroll_to_top, 100) }
function option_toggled () {}

function scroll_to_top ()    { window.scrollTo({ top: 0 }) }
function scroll_to_bottom () { window.scrollTo({ top: document.body.scrollHeight }) }

function hide_el (el) { el.style.visibility = 'hidden';  el.style.opacity =   '0%' }
function show_el (el) { el.style.visibility = 'visible'; el.style.opacity = '100%' }

// }}}

function make_audio_list (sura_bgn, aaya_bgn, sura_end, aaya_end) {  // {{{
  // returns ayat ref in the form sprintf("%03d%03d", sura_num, aaya_num)
  return (
    [...Array(115).keys()].slice(+sura_bgn + 1, +sura_end + 2)
      // s is the sura number, 1-based
      .map(s => [...Array(+suar_length[s - 1] + 1).keys()]
        .slice(s === +sura_bgn + 1? +aaya_bgn     :   1,
               s === +sura_end + 1? +aaya_end + 1 : 300  // larger than any sura
        )
        .map(a => s.toString().padStart(3,'0')
                + a.toString().padStart(3,'0')
        )
      )
      .reduce((list, s) => {  // https://stackoverflow.com/a/38528645
        if (s[0].match(/001$/) &&  // if it's the first aaya of the sura
            !s[0].match(/^001/) && // and it's is not al-faatiha
            !s[0].match(/^009/)    // and it's is not at-tawba
        ) {
          s.unshift('001001')      // add basmala
        }
        list.push(...s)  // flatten
        return list
      }, [])
  )
}  // }}}

// function make_words_list (sura_bgn, aaya_bgn, sura_end, aaya_end) {  // {{{
function make_words_list (st, en) {  // {{{1

  // const st = +suar_length.slice(0, sura_bgn).reduce((a,b)=>a+b, 0) + +aaya_bgn
  // const en = +suar_length.slice(0, sura_end).reduce((a,b)=>a+b, 0) + +aaya_end

  // all spaces are a single space in html;
  // let's make tab ('\t') separates the words,
  // and newline (actually '<br>\n') separates the ayat.

  return (
    ayat
      .slice(st-1, en)
      .reduce((arr, aya) => {  // https://stackoverflow.com/a/38528645
        if (aya.startsWith('#')) {
          arr.push(basmala)
          aya = aya.replace('#', '')
        }
        arr.push(aya)
        return arr
      }, [])
      // for quran-data
      .map(a => a.replace(/\xa0(?=\u0670)/g, ''))
      .map(a => a.replace(/أ\u064eو\u064e /g, 'أ\u064eو\u064e'))
      // // for hafs font
      // .map(a => a.replace(/ـ(?=\u0670)/g, ''))  // tatweel
      // .map(a => a.replace(/\u06cc/g, 'ي'))  // farsi yeh
      // .map(a => a.replace(/[A-Z<>]+/g, ''))
      // continuing
      .map(a => tajweed_colorize_aaya(a))
      .map(a => a.replace(/ /g, '\t<SPC>') + '<br>\n')
      .map(a => a.replace(/_/g, ' '))  // for tajweed
      .reduce((arr, aya) => {
        arr.push(...aya.split('<SPC>', -1))  // split and flatten
        return arr
      }, [])
  )
}  // }}}

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

function sync_ui (stpair, enpair, qari, preserve_url) {
  if (!preserve_url) { window.location.hash = stpair.join('/') + '-' + enpair.join('/') }
  //
  el_sura_bgn.value = stpair[0]-1; el_aaya_bgn.value = filter_aaya_input(stpair[1])
  el_sura_end.value = enpair[0]-1; el_aaya_end.value = filter_aaya_input(enpair[1])
  //
  el_qaris.value = qari  // if set thru url parameters
}

function init_audio (stpair, enpair, qari, preserve_url) {
  audio.init(qari)
  audio.fill(make_audio_list(stpair[0]-1, stpair[1], enpair[0]-1, enpair[1]))
}

function recite (st, en, qari, preserve_url) {

  const stpair = idx2aya(st-1)
  const enpair = idx2aya(en-1)
  sync_ui(stpair, enpair, qari, preserve_url)
  init_audio(stpair, enpair, qari, preserve_url)

  hide_selectors()
  el_txt.focus()

  // let words = make_words_list(sura_bgn, aaya_bgn, sura_end, aaya_end)
  let words = make_words_list(st, en)

  const fwd = function (kind) {
    let txt = ''
    const isnt_the_kind =
      kind === 'a'? (k) => k !== 'a' :
      kind === 'j'? (k) => k !== 'a' && k !== 'j' :
                    (k) => false
    if (words.length > 0) {
      let new_word_kind
      do {
        let new_word = words.shift()
        txt += new_word
        new_word_kind = kind_of_portion( new_word.slice(-2) )
      } while (isnt_the_kind(new_word_kind))
      if (new_word_kind === 'a') { audio.play_next() }
      el_txt.innerHTML += txt
    }
    else {
      show_done()
    }
    scroll_to_bottom()
  }

  const word_fwd = () => fwd('w')
  const aaya_fwd = () => fwd('a')
  const jmla_fwd = () => fwd('j')

  const word_bck = function (ev) {
    if (el_txt.innerHTML.length === 0) { return 'a' }
    if (!el_endmsg.hidden) { return 'a' }
    const last_word = el_txt.innerHTML.match(/(?:^|\t|<br>\n)([^\n\t]+(?:\t|<br>\n))$/)[1]
    words.unshift(last_word)
    el_txt.innerHTML = el_txt.innerHTML.substring(0, el_txt.innerHTML.length - last_word.length)
    if (last_word.match(/<br>\n$/)) { audio.back() }
    return kind_of_portion( el_txt.innerHTML.slice(-2) )
  }

  const aaya_bck = function (ev) {
    do { var c = word_bck() } while (c !== 'a')
  }

  const jmla_bck = function (ev) {
    do { var c = word_bck() } while (c !== 'a' && c !== 'j')
  }

  const input_trigger = function (ev) {

    const kb_mod = ev.shiftKey || ev.ctrlKey || ev.altKey
    const kb_fwd = ev.key === ' ' || ev.key === 'Enter' || ev.key === 'ArrowLeft'
    const kb_bck = ev.key === 'Backspace' || ev.key === 'ArrowRight'
    const not_on_input_field =  // not just ayat and suar
      ev.target.nodeName !== 'INPUT' && ev.target.nodeName !== 'SELECT'

    // Enter or Space, and the target is not input or select, get the next word
    // (ie, on the #ok button, or in the page with no element focused)
    // or mouse-click on the ok button

    if (ev.type === 'mouseup' && ev.target.id === 'ok') { word_fwd(); return }
    if (kb_fwd && !kb_mod && not_on_input_field)        { word_fwd(); return }
    if (kb_bck && !kb_mod && not_on_input_field)        { word_bck(); return }

    if (kb_fwd && kb_mod && not_on_input_field) { aaya_fwd(); return }
    if (kb_bck && kb_mod && not_on_input_field) { aaya_bck(); return }

    if (ev.key === '0' && not_on_input_field) { jmla_fwd(); return }
    if (ev.key === '1' && not_on_input_field) { jmla_bck(); return }

  }

  // both events are the "up" variants to disable repeating (holding down
  // the key, even for a few additional milliseconds by accident), which
  // prints a lot of words
  document.onkeyup = input_trigger
  el_nextword.onclick = word_fwd
}

el_ok.onclick  = start_reciting
// el_ok.onmouseup  = input_trigger

function chstyle () {
  const sync_class_with = (cls, pred) =>
    pred ? Q('body').classList.add(cls) : Q('body').classList.remove(cls)
  //
  const tval = Qid('textclr_input').value
  sync_class_with('letter-parts',   tval === 'bas')
  sync_class_with('letter-nocolor', tval === 'no')
  //
  sync_class_with('ayat-nocolor', !Qid('ayatnum_input').checked)
  //
  // sync_class_with('dark', Qid('darkmode_input').checked)
  Qid('dark').checked = Qid('darkmode_input').checked
}

el_repeat.onmouseup = start_reciting
el_repeat.onclick   = start_reciting

function init_inputs () {
  el_sura_bgn.value   = el_aaya_bgn.value   = el_sura_end.value   = el_aaya_end.value   = ''
  el_sura_bgn.oninput = el_aaya_bgn.oninput = el_sura_end.oninput = el_aaya_end.oninput = validate_aaya_sura_input
  el_sura_bgn.onblur  = el_aaya_bgn.onblur  = el_sura_end.onblur  = el_aaya_end.onblur  = validate_aaya_sura_input
  el_sura_bgn.onkeyup = el_aaya_bgn.onkeyup = el_sura_end.onkeyup = el_aaya_end.onkeyup = input_trigger_x
}

function decode_contact () {
  let xyz = Qid('xyz')
  let mia_nomo = Q('body').innerHTML.match(/github[.]com\/([a-z0-9]+)\//)[1]
  xyz.innerHTML = mia_nomo + '_'.charCodeAt(0) + String.fromCharCode(1<<6) + 'moc.liamg'.split('').reverse().join('')
  xyz.href = xyz.innerHTML.slice(13,17) + 'to' + String.fromCharCode('xyz'.charCodeAt(1<<1)^0100) + xyz.innerHTML
  // if you know a better way, please let me know!
}

const hide_selectors = function () {
  el_selectors.hidden = true
  el_header.hidden = false
  el_txt.innerHTML = ''
  el_endmsg.hidden = true
  el_ok.hidden = true
  el_nextword.hidden = false
}

const show_selectors = function () {
  el_selectors.hidden = false
  el_header.hidden = true
  el_ok.hidden = false
  el_nextword.hidden = true
}

const new_select = function () {
  show_selectors()
  el_txt.innerHTML = ''
  el_endmsg.hidden = true
}

el_new.onmouseup = new_select
el_new.onclick   = new_select

// ligilumi: reading url parameters {{{
function range_to_pair (x) {
  let xs = x.split('-')
  return xs.length === 2 ? xs : xs.length === 1 ? [x, x] : [null, null]
}

const MAX_JUZ  = 30
const MAX_HIZB = 60
const MAX_RUB  = 240
const MAX_AYA  = 6236
const MAX_SURA = 114
const MAX_PAGE = 604
const MAX_RUKU = 556

function suras_to_ayat (stsura, ensura) {  // each is 1-114
  if (stsura == null) { return [null, null] }
  stsura = +stsura || 1; ensura = +ensura || MAX_SURA
  if (stsura > MAX_SURA || ensura > MAX_SURA) { return [null, null] }
  const st = start_(stsura-1) + 1
  const en = start_(ensura-1) + suar_length[ensura-1]
  return [st, en]
}
function idx2aya (idx) {  // 0-6235
  if (idx < 0 || idx > 6236) { return [null, null] }
  const s = [...Array(114).keys()].find(s => idx >= start_(s) && idx < start_(s+1))
  return [s+1, idx - start_(s) + 1]
}


function _aya2idx (aya) {  // 1-6236 or 1/7
  if (aya.includes('/')) {
    let a = aya.split('/');
    if (a.length !== 2 || +a[0] > MAX_SURA || +a[1] > suar_length[+a[0]-1]) { return }
    return start_(+a[0] - 1) + +a[1]
  }
  else {
    if (+aya > MAX_AYA) { return }
    return +aya
  }
}

function ayat_to_ayat (staya, enaya) {  // each is 1-6236 or 1/7 (sura/aya)
  if (staya == null) { return [null, null] }
  let st = _aya2idx(staya)
  let en = _aya2idx(enaya)
  if (st == null || en == null) { return [null, null] }
  st = +st || 1; en = +en || MAX_AYA
  return [st, en]
}

function __sura_ruku__to__st_en (s, k) {
  if (k > rukus[s-1].length) { return null }
  const st = start_(s-1) + rukus[s-1][k-1]
  const en = k === rukus[s-1].length
    ? -1 + start_(s)   + rukus[s][0]    // next sura
    : -1 + start_(s-1) + rukus[s-1][k]  // same sura
  return [st, en]
}

function _ruku2idx (ruku) {  // each is 1/1 (sura/ruku) -- TODO: remove redundant computations
  if (ruku.includes('/')) {
    let k = ruku.split('/')
    if (k.length !== 2 || +k[0] > MAX_SURA) { return null }
    return __sura_ruku__to__st_en(+k[0], +k[1])
  }
  else {
    if (+ruku > MAX_RUKU) { return }
    for (let s = 0; s < MAX_SURA; ++s) {
      const max_sura_ruku = rukus[s].length
      for (let r = 0; r < max_sura_ruku; ++r) {
        ruku -= 1
        if (ruku === 0) { return __sura_ruku__to__st_en(s+1, r+1) }
      }
    }
  }
}

function rukus_to_ayat (struku, enruku) {  // each is 1/1 (sura/ruku)
  if (struku == null) { return [null, null] }
  let stpair = _ruku2idx(struku)
  let enpair = _ruku2idx(enruku)
  if (stpair == null || enpair == null) { return [null, null] }
  return [stpair[0], enpair[1]]
}

function pages_to_ayat (stpage, enpage) {  // each is 1-604
  if (stpage == null) { return [null, null] }
  stpage = +stpage || 1; enpage = +enpage || MAX_PAGE
  if (stpage > MAX_PAGE || enpage > MAX_PAGE) { return [null, null] }
  let st = pages[+stpage - 1] + 1
  let en = pages[+enpage]
  return [st, en]
}

function juzs_to_ayat (stjuz, enjuz) {  // each is 1-30
  if (stjuz == null) { return [null, null] }
  stjuz = +stjuz || 1; enjuz = +enjuz || MAX_JUZ
  if (stjuz > MAX_JUZ || enjuz > MAX_JUZ) { return [null, null] }
  // we multiply by 8, as we have only data for rubs.
  const ratio = MAX_RUB / MAX_JUZ  // 8
  let st = rubs[((stjuz || 1)      - 1) * ratio] + 1
  let en = rubs[((enjuz || MAX_JUZ)   ) * ratio]
  return [st, en]
}

function _rub2idx (rub) {  // 1-240 or 1/1-60/4 or 1//1-30//8.
  // 30//8: [0] is juz, [1] is 1/8; i.e., it's the ([0]-1)*8+[1] 'th rub
  // 60/4: [0] is hizb, [1] is 1/4; i.e., it's the ([0]-1)*4+[1] 'th rub
  // 240: it's the nth rub
  // a rub is 1/4 of a hizb, and a hizb is 1/2 of a juz, thus a rub is 1/8 of a juz.
  if (rub.includes('//')) {
    const ratio = MAX_RUB / MAX_JUZ  // 8
    let r = rub.split('//');
    if (r.length !== 2 || +r[0] > MAX_JUZ || +r[1] > ratio) { return }
    return (+r[0] - 1)*ratio + +r[1] + 1
  }
  else if (rub.includes('/')) {
    const ratio = MAX_RUB / MAX_HIZB  // 4
    let r = rub.split('/');
    if (r.length !== 2 || +r[0] > MAX_HIZB || +r[1] > ratio) { return }
    return (+r[0] - 1)*ratio + +r[1] + 1
  }
  else {
    if (+rub > MAX_RUB) { return }
    return +rub
  }
}

function rubs_to_ayat (strub, enrub) {  // each is 1-240 or 1/1-60/4 or 1//1-30//8.
  if (strub == null) { return [null, null] }
  const stidx = _rub2idx(strub)
  const enidx = _rub2idx(enrub)
  if (stidx == null || enidx == null) { return [null, null] }
  let st = rubs[(stidx || 1) - 1] + 1
  let en = rubs[ enidx || 240   ]
  return [st, en]
}

function _hizb2idx (hizb) {  // 1-60 or 1/1-30/2.
  // 30/2: [0] is juz, [1] is 1/2; i.e., it's the ([0]-1)*2+[1] 'th hizb
  // 60: it's the nth hizb
  // a rub is 1/4 of a hizb, and a hizb is 1/2 of a juz, thus a rub is 1/8 of a juz.
  if (hizb.includes('/')) {
    const ratio = MAX_HIZB / MAX_JUZ  // 2
    let h = hizb.split('/');
    if (h.length !== 2 || +h[0] > MAX_JUZ || +h[1] > ratio) { return }
    return (+h[0] - 1)*ratio + +h[1] + 1
  }
  else {
    if (+hizb > MAX_HIZB) { return }
    return +hizb
  }
}

function hizbs_to_ayat (sthizb, enhizb) {  // each is 1-240 or 1/1-60/4 or 1//1-30//8.
  if (sthizb == null) { return [null, null] }
  const stidx = _hizb2idx(sthizb)
  const enidx = _hizb2idx(enhizb)
  if (stidx == null || enidx == null) { return [null, null] }
  // we multiply by 4, as we have only data for rubs.
  const ratio = MAX_RUB / MAX_HIZB  // 4
  let st = rubs[((stidx || 1) - 1) * ratio] + 1
  let en = rubs[((enidx || 60)   ) * ratio]
  return [st, en]
}

function _ligilumilo (href) {
  let a = 0; let b = 0
  let st; let en
  let dark
  // possible params:
  // - p: page. 1-604.
  // - s: sura, an entire sura. 1-114.
  // - j: juz,  an entire juz.  1-30.
  // - h: hizb, an entire hizb. 1-60  or 1/1-30/2.
  // - r: rub,  an entire rub.  1-240 or 1/1-60/4 or 1//1-30//8.
  // - b: before, a number of ayat to add before whatever you select. 0-inf.
  // - a: after,  a number of ayat to add before whatever you select. 0-inf.
  // - dark & light: dark mode
  // TODO: m for manzil & k for ruku & (maybe) t for thumn (1/8 of hizb)
  // TODO: acolor & anocolor: ayat-colors
  // TODO: tajweed & lparts & lnocolor: letter-colors
  // TODO: audio
  href
    .split(/[#&]/)
    .map(p => p.split('='))
    //.reduce((obj, cur, i) => { i == 0? {} : (obj[cur[0]] = cur[1], obj), {})
    .forEach((e, i) => {
      if      (i == 0)       { return }  // ignore the file portion
      else if (e[0] === 'dark'  || e[0] === 'd') { dark = true  }
      else if (e[0] === 'light' || e[0] === 'l') { dark = false }
      else if (e[0] === 'a') { a = +e[1] }
      else if (e[0] === 'b') { b = +e[1] }
      else if (e[0] === 'p') { [st, en] = pages_to_ayat(...range_to_pair(e[1])) }
      else if (e[0] === 's') { [st, en] = suras_to_ayat(...range_to_pair(e[1])) }
      else if (e[0] === 'r') { [st, en] =  rubs_to_ayat(...range_to_pair(e[1])) }
      else if (e[0] === 'h') { [st, en] = hizbs_to_ayat(...range_to_pair(e[1])) }
      else if (e[0] === 'j') { [st, en] =  juzs_to_ayat(...range_to_pair(e[1])) }
      else if (e[0] === 'k') { [st, en] = rukus_to_ayat(...range_to_pair(e[1])) }
      else                   { [st, en] =  ayat_to_ayat(...range_to_pair(e[0])) }
    })
  if (dark || dark === false) { Qid('darkmode_input').checked = dark; chstyle() }
  if (st == null || en == null) { return [null, null, dark] }
  st -= b; en += a
  if (st <= 0)    { st = 1    }
  if (en >  6236) { en = 6236 }
  return [st, en, dark]
}

function ligilumi () {
  const [st, en, dark] = _ligilumilo(window.location.href)
  if (dark || dark === false) { Qid('darkmode_input').checked = dark; chstyle() }
  if (st == null || en == null) { return }
  recite(st, en, '', true)
}

/*
function test_ligilumi () {
  let fail=0, all=0, st, en, d
  [
    ['#p=1',            1,             7],
    ['#p=1&a=1',        1,             8],
    ['#p=1&b=1',        1,             7],
    ['#p=1&a=1&b=1',    1,             8],
    ['#p=1&a=1&b=-1',   2,             8],
    ['#p=1&a=-1&b=-1',  2,             6],
    ['#p=1&b=-1&a=-1',  2,             6],
    ['#p=2',            8,             12],
    ['#p=1-2',          1,             12],
    ['#s=1',            1,             7],
    ['#s=2',            8,             7+286],
    ['#s=3',            7+286+1,       7+286+200],
    ['#s=112',          6236-6-5-4+1,  6236-6-5],
    ['#s=113',          6236-6-5+1,    6236-6],
    ['#s=114',          6236-6+1,      6236],
    ['#p=604',          6236-6-5-4+1,  6236],
    ['#j=1',            1,             141+7],
    ['#r=-8',           1,             141+7],
    ['#r=1-8',          1,             141+7],
    ['#r=-1//7',        1,             141+7],
    ['#r=-2/3',         1,             141+7],
    ['#j=2',            142+7,         252+7],
    ['#j=2-3',          142+7,         92+286+7],
    ['#j=2-',           142+7,         6236],
    ['#j=-3',           1,             92+286+7],
    ['#j=3-',           253+7,         6236],
    ['#h=-',            1,             6236],
    ['#h=-2',           1,             141+7],
    ['#h=1-2',          1,             141+7],
    ['#h=2/0-2/1',      142+7,         252+7],
    ['#h=2-3',          75+7,          202+7],
    ['#h=1/1-2/0',      75+7,          202+7],
    ['#r=-',            1,             6236],
    ['#r=-2',           1,             43+7],
    ['#r=1-2',          1,             43+7],
    ['#r=2//0-2//7',    142+7,         252+7],
    ['#r=5-12',         75+7,          202+7],
    ['#r=2/0-3/3',      75+7,          202+7],
    ['#r=2/0-3/2',      75+7,          188+7],
    ['#r=6/1',          7+286+33,      7+286+51],
    ['#8',              8,             8],
    ['#120-1299',       120,           1299],
    ['#k=1/1',          1,             7],
    ['#k=2/1',          8,             7+7],
    ['#k=2/2',          8+7,           7+20],
    ['#k=2/3',          8+20,          7+29],
    ['#k=2/4',          8+29,          7+39],
    ['#k=3/1',          8+286,         293+9],
    ['#k=3/2',          8+286+9,       293+20],
    ['#k=1',            1,             7],
    ['#k=2',            8,             7+7],
    ['#k=3',            8+7,           7+20],
    ['#k=4',            8+20,          7+29],
    ['#k=5',            8+29,          7+39],
    ['#k=42',           8+286,         293+9],
    ['#k=43',           8+286+9,       293+20],
    ['#114/1-114/6',    6231,          6236],
    ['#k=556',          6231,          6236],
  ]
  .forEach((t) => {
    [st, en, d] = _ligilumilo(t[0])
    if (st !== t[1] || en !== t[2]) {
      console.log(t[0], ' got', st, en, ' exp', t[1], t[2])
      fail += 1
    }
    all += 1
  })
  console.log('test finished;', fail, 'failed out of', all)
}
test_ligilumi()/**/ // }}}

onload = function () {
  el_ok.disabled = true
  init_inputs()
  chstyle()  // to update the style, as we don't reset these
             // inputs, so they keep their values on refresh.
  decode_contact()
  ligilumi()
}
// vim: set sw=2 ts=2 et fdm=marker colorcolumn=80:
