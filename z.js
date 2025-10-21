////////////////////////////////////////////////////////////////////////////////
// audio

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


////////////////////////////////////////////////////////////////////////////////
// loading compressed files

// const MX = 6236
var ayat = {}
// u: uthmani text with tajweed color-coding
// i: imlaai text with tashkeel etc
// p: plain imlaai for searching (generated from imlaai)

// function unzstd (path, callback) {  // zstd-compressed files
//   fetch(path)
//     .then((res) => res.ok ? res.arrayBuffer() : null)
//     .then((buf) => {
//       callback( (new TextDecoder).decode( fzstd.decompress(new Uint8Array(buf)) ).split('\n').slice(0,-1) )
//     })
// }

function unlzma (path, callback) {  // lzma-compressed files
  fetch(path)
    .then((res) => res.ok ? res.arrayBuffer() : null)
    .then((buf) => {
      callback(LZMA.decompress(new Uint8Array(buf)).split('\n').slice(0,-1))
    })
}

function load (name, callback) {
  // console.assert(name === 'u' || name === 'i', 'load called with bad name:', name)
  if (ayat[name]) { callback(); return }
  // unzstd(`res/${name}.zst?h=${zhash[name]}`, (txt) => { ayat[name] = txt; callback() })
  unlzma(`res/${name}.lzma`, (txt) => { ayat[name] = txt; callback() })
}

function load_plain (callback) {
  if (ayat.p) { callback(); return }
  load('i', () => {
    ayat.p = ayat.i.map(a => a
      .replace(/[^ ء-غف-ي\n]/g, '')  // eliminate all except plain letters
      .replace(/^|$/g, ' ')  // surround each aaya by space, so that spaces always delimit words, for searching
    )
    callback()
  })
}

////////////////////////////////////////////////////////////////////////////////
// imlaai loading

function imlaai_ayat (st, en, cn) {

  // continuation; ie, append a "phrase" from the next aaya if in the same sura
  const last_aya_of_sura = sura_offset[sura_of(en)]  // offset of the next sura == end aaya of the current sura
  if (cn && en < last_aya_of_sura) {  // don't continue if at the end of sura
    en += 1
  }
  // in imlaai, append the entire next aaya. only 1356 ayat have a partial continuation (22% of the Quran).
  // but currently the imlaai mode has no concept of partial aaya, so the entire next aaya is added.
  // continuation may not make a lot of sense in imlaai, but it's still useful for quizzing apps that embed Recite.

  return (
    ayat.i
      .slice(st-1,en)
      .map(a => a.startsWith('#') ? a.replace('#', 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ\n') : a)
      .join('\n')
      + '\n'
  )
}

////////////////////////////////////////////////////////////////////////////////
// uthmani utils

const parse_aaya = (a) => a
  // tajweed colorize
  .replace(/([A-Z])<([^>]+)>/g, '<span_class="$1">$2</span>')


////////////////////////////////////////////////////////////////////////////////
// uthmani loading

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
      .replace(/\xa0.*/, '').replace(/ /g, '\xa0')

  return (
    ayat.u
      .slice(st-1, en)
      .reduce((arr, aya, i) => {
        aya = aya.replace(/A/, (i+st)+'A')  // for tafsir
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
          if (continuation_twophrases.has(en-1)) {
            console.log(aya)
            aya = aya.replace(/([\u06D6\u06D7\u06D8\u06DA\u06DB] .*?[\u06D6\u06D7\u06D8\u06DA\u06DB]) .*/, '$1')  // sakta (high seen) does NOT separate phrases
            console.log(aya)
          }
          else if (continuation_fullaaya.has(en-1)) {
            // do nothing; ie keep the full aaya
          }
          else {
            aya = aya.replace(/([\u06D6\u06D7\u06D8\u06DA\u06DB]) .*/, '$1')  // sakta (high seen) does NOT separate phrases
          }
        }
        arr.push(aya)
        return arr
      }, [])
      .map(aya => parse_aaya(aya)
          .replace(/ /g, '\t<SPC>')
          .replace(/_/g, ' ')  // for spans
          .replace(/([0-9]+)(<span)/, '$2 onclick="tv($1)"')  // for tafsir
          + '\n'
      )
      .reduce((arr, aya, i, allayat) => {
        arr.push(...aya.split('<SPC>', -1))  // split and flatten
        return arr
      }, [])
  )
}

////////////////////////////////////////////////////////////////////////////////
// debug utils

function say (...a) { return console.log(...a) }

function debug_uthm (a) { return a
  .replace(/[A-Z]<([^>]*)>/g, '$1')
  .replace(/<\/?span[^<>]*>/g, '')
  .replace(/\u06dd([٠-٩]+)/g, '($1)')
  .replace(/[\u06de\u06e9]/g, '*')
  .replace(/[\u06d6-\u06ed\u08f0-\u08f3]/g, '')
  .replace(/\t/g, '⇆')
  .replace(/\n/g, '⮐')
}

function ascii_debug_uthm (a) { return a  // not really ascii, but latin and latin-like
  .replace(/[A-Z]<([^>]*)>/g, '$1')
  .replace(/<\/?span[^<>]*>/g, '')
  .replace(/\u06dd([٠-٩]+)/g, '($1)')

  .replace(/<pr-line[^<>]*>/g, '<')
  .replace(/<\/pr-line>/g, '>')

  .replace(/ /g, '_')
  .replace(/\t/g, '⇆ ')
  .replace(/\n/g, '⮐\n')

  .replace(/.\u06df/g, '')

  .replace(/ٱ/g, 'ə')

  .replace(/\u064e?ى/g, 'ä')
  .replace(/\u064e?[\xa0\u0640]\u0670/g, 'ᵃᵃ')
  .replace(/[\u064b\u08f0][اى]?/g, 'ᵃᴺ')
  .replace(/\u064e\u06e2[اى]?/g, 'ᵃᵐ')
  .replace(/\u064e/g, 'ᵃ')
  .replace(/\u064e?ا\u06E0/g, 'a')
  .replace(/\u064e?ا/g, 'ā')

  // .replace(/\u064fو\u06df/g, 'ʷ')
  .replace(/\u064fو/g, 'ū')
  .replace(/و/g, 'w')
  .replace(/\u064f\u0640\u08f3/g, 'ᵘᵘ')
  .replace(/\u064f\u06e5/g, 'ᵘᵘ')
  .replace(/[\u064c\u08f1]/g, 'ᵘᴺ')
  .replace(/\u064f\u06e2/g, 'ᵘᵐ')
  .replace(/\u064f/g, 'ᵘ')

  // .replace(/\u0650ی\u06df/g, 'ʸ')
  .replace(/\u0650ی/g, 'ī')
  .replace(/ی/g, 'y')
  .replace(/\u0650\u0640\u06e7/g, 'ⁱⁱ')
  .replace(/\u0650\u06e6/g, 'ⁱⁱ')
  .replace(/[\u064d\u08f2]/g, 'ⁱᴺ')
  .replace(/\u0650\u06ed/g, 'ⁱᵐ')
  .replace(/\u0650/g, 'ⁱ')

  .replace(/\u0651/g, 'ː')

  .replace(/[أإؤئ]/g, 'ɂ')
  .replace(/ب/g, 'b')
  .replace(/ت/g, 't') .replace(/ث/g, 'θ')
  .replace(/ج/g, 'j')
  .replace(/ح/g, 'ħ') .replace(/خ/g, 'x')
  .replace(/د/g, 'd') .replace(/ذ/g, 'ð')
  .replace(/ر/g, 'r') .replace(/ز/g, 'z')
  .replace(/س/g, 's') .replace(/ش/g, 'ʃ')
  .replace(/ص/g, 'S') .replace(/ض/g, 'D')
  .replace(/ط/g, 'T') .replace(/ظ/g, 'Z')
  .replace(/ع/g, 'ȝ') .replace(/غ/g, 'ğ')
  .replace(/ف/g, 'f')
  .replace(/ق/g, 'q') .replace(/ك/g, 'k')
  .replace(/ل/g, 'l')
  .replace(/م/g, 'm') .replace(/ن/g, 'n') .replace(/n\u06e2/g, 'ᵐ')
  .replace(/ه/g, 'h') .replace(/ة/g, 'τ')

  .replace(/[٠-٩]+/g, (n) => toascii(n))
  .replace(/\u0305/g, '')
  .replace(/\u06de/g, '*')

  .replace(/\u06D6/g, 'ᴸ')    // ARABIC SMALL HIGH LIGATURE SAD WITH LAM WITH ALEF MAKSURA
  .replace(/\u06D7/g, 'ᴳ')  // ARABIC SMALL HIGH LIGATURE QAF WITH LAM WITH ALEF MAKSURA
  .replace(/\u06D8/g, 'ᴹ')  // ARABIC SMALL HIGH MEEM INITIAL FORM
  .replace(/\u06DA/g, 'ᴶ')  // ARABIC SMALL HIGH JEEM
  .replace(/\u06DB/g, '^')  // ARABIC SMALL HIGH THREE DOTS
  .replace(/S\u06DC/g, 's')  // ARABIC SMALL HIGH SEEN
  .replace(/\u06DC/g, 'ˢ')  // ARABIC SMALL HIGH SEEN
  // .replace(/\u06DF/g, '')  // ARABIC SMALL HIGH ROUNDED ZERO
  // .replace(/\u06E0/g, '')  // ARABIC SMALL HIGH UPRIGHT RECTANGULAR ZERO
  .replace(/\u06E1/g, '')  // ARABIC SMALL HIGH DOTLESS HEAD OF KHAH -- removed
  .replace(/\u06E3/g, '')  // ARABIC SMALL LOW SEEN -- removed
  .replace(/\u06E4/g, '~')  // ARABIC SMALL HIGH MADDA
  .replace(/\u06E8/g, 'ⁿ')  // ARABIC SMALL HIGH NOON
// 006E9 ARABIC PLACE OF SAJDAH
// 006EA ARABIC EMPTY CENTRE LOW STOP
// 006EB ARABIC EMPTY CENTRE HIGH STOP
// 006EC ARABIC ROUNDED HIGH STOP WITH FILLED CENTRE

}

function debug_uthm_raw (a) { return debug_uthm(parse_aaya(a))
  // .replace(/[A-Z]<([^>]*)>/g, '$1')
}

