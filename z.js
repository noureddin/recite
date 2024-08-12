function tajweed_colorize_aaya (a) {
  return a.replace(/([A-Z])<([^>]+)>/g, '<span_class="$1">$2</span>')
}

// returns ayat ref in the form sprintf("%03d%03d", sura_num, aaya_num)
const make_audio_list = (sura_bgn, aaya_bgn, sura_end, aaya_end) =>
  range(115).slice(+sura_bgn + 1, +sura_end + 2)
    // s is the sura number, 1-based
    .map(s => range(+sura_length[s - 1] + 1)
      .slice(s === +sura_bgn + 1 ? +aaya_bgn     :   1,
             s === +sura_end + 1 ? +aaya_end + 1 : 300  // larger than any sura
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

// const MX = 6236
var ayat = {}
// u: uthmani text with tajweed color-coding
// i: imlaai text with tashkeel etc
// p: plain imlaai for searching (generated from imlaai)

function z (lzma_file, callback) {
  fetch(lzma_file)
    .then((res) => res.ok ? res.arrayBuffer() : null)
    .then((buf) => {
      callback(LZMA.decompress(new Uint8Array(buf)).split('\n').slice(0,-1))
    })
}

function load (name, callback) {
  // console.assert(name === 'u' || name === 'i', 'load called with bad name:', name)
  if (ayat[name]) { callback(); return }
  z(`res/${name}.lzma`, (txt) => { ayat[name] = txt; callback() })
}

function load_plain (callback) {
  if (ayat.p) { callback(); return }
  load('i', () => {
    ayat.p = ayat.i.map(a => a
      .replace(/[^ ء-ي\n]/g, '')  // eliminate all except plain letters
      .replace(/^|$/g, ' ')       // surround each aaya by space, so that spaces always delimit words
    )
    callback()
  })
}

function imlaai_ayat (st, en) {

  return (
    ayat.i
      .slice(st-1,en)
      .map(a => a.startsWith('#') ? a.replace('#', 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ\n') : a)
      .join('\n')
      + '\n'
  )
}

function make_words_list (st, en, cn) {  // uthmani

  // continuation; ie, append a "phrase" from the next aaya if in the same sura
  const last_aya_of_sura = sura_offset[sura_of(en)]  // offset of the next sura == end aaya of the current sura
  if (cn && en < last_aya_of_sura) {  // don't continue if at the end of sura
    en += 1
  }
  else {
    cn = false
  }

  // const st = +sura_length.slice(0, sura_bgn).reduce((a,b)=>a+b, 0) + +aaya_bgn
  // const en = +sura_length.slice(0, sura_end).reduce((a,b)=>a+b, 0) + +aaya_end

  // all spaces are a single space in html;
  // let's make tab ('\t') separates the words,
  // and newline ('\n' with 'whitespace: pre-line') separates the ayat.

  const basmala = 'بِسۡمِ ٱللَّهِ ٱX<ل>R<رَّ>حۡمَT<ـٰ>نِ ٱX<ل>R<رَّ>حِJ<ی>مِ A<۝>D<١>'  /* uthm[0] */
      .replace(/\xa0.*/, '').replace(/ /g, '\xa0')  // '\ufdfd'

  return (
    ayat.u
      .slice(st-1, en)
      .map((aya, i) => aya.replace(/A/, (i+st)+'A'))  // for tafsir
      .reduce((arr, aya, i) => {
        // https://stackoverflow.com/a/38528645
        if (aya.startsWith('#')) {  // start of all suar except sura 1 and sura 9
          arr.push(basmala+'<br>')
          aya = aya.replace('#', '')
        }
        else if (aya.startsWith('\u06de\xa0بَ')) {  // start of sura 9
          aya = '<br>'+aya
          // force a line break before the beginning of sura 9,
          // in place of the non-existent basmala.
          // only has an effect if linebreaks are disabled (#linebreaks_input),
          // and the reciting/previewing starts before it and ends at it or later.
        }
        if (cn && i === en-st) {
          // based on kind_of_portion() in a.js
          aya = aya.replace(/([\u06DC\u06D6\u06D7\u06D8\u06DA\u06DB]) .*/, '$1')
        }
        arr.push(aya)
        return arr
      }, [])
      .map(a => (
          tajweed_colorize_aaya(a)
          .replace(/ /g, '\t<SPC>')
          + '\n'
        )
        .replace(/_/g, ' ')  // for tajweed spans
        .replace(/([0-9]+)(<span)/, '$2 onclick="tv($1)"')  // for tafsir
      )
      .reduce((arr, aya) => {
        arr.push(...aya.split('<SPC>', -1))  // split and flatten
        return arr
      }, [])
  )
}
