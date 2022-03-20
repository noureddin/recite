function tajweed_colorize_aaya (a) {
  return a.replace(/([A-Z])<([^>]+)>/g, '<span_class="$1">$2</span>')
}

function make_audio_list (sura_bgn, aaya_bgn, sura_end, aaya_end) {
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
}

function load_zip(basename, callback) {
  const filename = 'res/' + basename + '.zip'
  JSZipUtils.getBinaryContent(filename, function(err, data) {
    if (err) { throw err /* or handle err */ }
    JSZip.loadAsync(data).then(function (zip) {
      return zip.file(basename).async('string')
    }).then(function (str) {
      callback(str.split('\n'))
    })
  })
}

var imla
var uthm = Array(6236)

function load_imla (callback) {
  if (imla == null) {
    load_zip('imla', (arr) => { imla = arr; callback() })
  } else { callback() }
}

// uthmani is split into two parts: until Surat Mariam (Sura 19), and then from Surat Ta-Ha.
// this is *not* arbitrary: it makes both parts almost the same size in bytes.
const FIRST_AAYA_OF_TAHA = 2349
function is_in_first_half  (st, en) { return (st-1 <  FIRST_AAYA_OF_TAHA || en <  FIRST_AAYA_OF_TAHA) }
function is_in_second_half (st, en) { return (st-1 >= FIRST_AAYA_OF_TAHA || en >= FIRST_AAYA_OF_TAHA) }

/* WARNING: the files are named othm1 & othm2 NOT uthmN as you may expect; do NOT change this! */

function load_uthm1 (callback) {
  if (uthm[0] == null) {  /* checking an arbitrary aaya in the 1st half */
    load_zip('othm1', (arr) => { uthm = [...arr, ...uthm.slice(FIRST_AAYA_OF_TAHA)]; callback() })
  } else { callback() }
}

function load_uthm2 (callback) {
  if (uthm[6000] == null) {  /* checking an arbitrary aaya in the 2nd half */
    load_zip('othm2', (arr) => { uthm = [...uthm.slice(0,FIRST_AAYA_OF_TAHA-1), ...arr]; callback() })
  } else { callback() }
}

function imlaai_ayat (st, en) {

  return (
    imla
      .slice(st-1,en)
      .map(a => a.startsWith('#')? a.replace('#', 'بسم الله الرحمن الرحيم\n') : a)
      .join('\n')
      + '\n'
  )
}

function make_words_list (st, en) {

  // const st = +suar_length.slice(0, sura_bgn).reduce((a,b)=>a+b, 0) + +aaya_bgn
  // const en = +suar_length.slice(0, sura_end).reduce((a,b)=>a+b, 0) + +aaya_end

  // all spaces are a single space in html;
  // let's make tab ('\t') separates the words,
  // and newline (actually '<br>\n') separates the ayat.

  const basmala = 'بِسۡمِ ٱللَّهِ ٱX<ل>R<رَّ>حۡمَT<ـٰ>نِ ٱX<ل>R<رَّ>حِJ<ی>مِ A<۝>D<١>'  /* uthm[0] */
      .replace(/\xa0.*/, '').replace(/ /g, '\xa0')  // '\ufdfd'

  return (
    uthm
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
      .map(a => a.replace(/أ\u064eو\u064e /g, 'أ\u064eو\u064e'))
      // continuing
      .map(a => tajweed_colorize_aaya(a))
      .map(a => a.replace(/ /g, '\t<SPC>') + '<br>\n')
      .map(a => a.replace(/_/g, ' '))  // for tajweed
      .reduce((arr, aya) => {
        arr.push(...aya.split('<SPC>', -1))  // split and flatten
        return arr
      }, [])
  )
}

// vim: set sw=2 ts=2 et fdm=marker colorcolumn=80:
