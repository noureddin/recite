function tajweed_colorize_aaya (a) {
  return a.replace(/([A-Z])<([^>]+)>/g, '<span_class="$1">$2</span>')
}

function make_audio_list (sura_bgn, aaya_bgn, sura_end, aaya_end) {
  // returns ayat ref in the form sprintf("%03d%03d", sura_num, aaya_num)
  return (
    range(115).slice(+sura_bgn + 1, +sura_end + 2)
      // s is the sura number, 1-based
      .map(s => range(+suar_length[s - 1] + 1)
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

var ayat = {
  imla: Array(6236),
  uthm: Array(6236),
}

// both imlaai and uthmani are split into nearly equal-size (in bytes) parts, without crossing suar.
// each of these constants is the aaya that starts that part.
const P2 =  494
const P3 =  955
const P4 = 1474
const P5 = 2141
const P6 = 2933
const P7 = 3789
const P8 = 4736

function load (name, st, en, callback) {

  const either_between = (a, b) => st >= a && st < b || en >= a && en < b

  // check what parts are needed
  const p1 = st < P2 || en < P2
  const p2 = either_between(P2, P3)
  const p3 = either_between(P3, P4)
  const p4 = either_between(P4, P5)
  const p5 = either_between(P5, P6)
  const p6 = either_between(P6, P7)
  const p7 = either_between(P7, P8)
  const p8 = st >= P8 || en >= P8

  // check an arbitrary aaya in the given quarter, then callback or load then callback
  const L1 = (cb) => ayat[name][ 0] ? cb() : load_zip(name+'1', (a) => { ayat[name] = [                             ...a, ...ayat[name].slice(P2)]; cb() })
  const L2 = (cb) => ayat[name][P2] ? cb() : load_zip(name+'2', (a) => { ayat[name] = [...ayat[name].slice(0,P2-1), ...a, ...ayat[name].slice(P3)]; cb() })
  const L3 = (cb) => ayat[name][P3] ? cb() : load_zip(name+'3', (a) => { ayat[name] = [...ayat[name].slice(0,P3-1), ...a, ...ayat[name].slice(P4)]; cb() })
  const L4 = (cb) => ayat[name][P4] ? cb() : load_zip(name+'4', (a) => { ayat[name] = [...ayat[name].slice(0,P4-1), ...a, ...ayat[name].slice(P5)]; cb() })
  const L5 = (cb) => ayat[name][P5] ? cb() : load_zip(name+'5', (a) => { ayat[name] = [...ayat[name].slice(0,P5-1), ...a, ...ayat[name].slice(P6)]; cb() })
  const L6 = (cb) => ayat[name][P6] ? cb() : load_zip(name+'6', (a) => { ayat[name] = [...ayat[name].slice(0,P6-1), ...a, ...ayat[name].slice(P7)]; cb() })
  const L7 = (cb) => ayat[name][P7] ? cb() : load_zip(name+'7', (a) => { ayat[name] = [...ayat[name].slice(0,P7-1), ...a, ...ayat[name].slice(P8)]; cb() })
  const L8 = (cb) => ayat[name][P8] ? cb() : load_zip(name+'8', (a) => { ayat[name] = [...ayat[name].slice(0,P8-1), ...a                         ]; cb() })

  // TODO: parallize
  if      (p1 && p8) { L1(()=> L2(()=> L3(()=> L4(()=> L5(()=> L6(()=> L7(()=> L8( callback )))))))) }

  else if (p1 && p7) { L1(()=> L2(()=> L3(()=> L4(()=> L5(()=> L6(()=> L7(         callback )))))))  }
  else if (p2 && p8) {         L2(()=> L3(()=> L4(()=> L5(()=> L6(()=> L7(()=> L8( callback )))))))  }

  else if (p1 && p6) { L1(()=> L2(()=> L3(()=> L4(()=> L5(()=> L6(                 callback ))))))   }
  else if (p2 && p7) {         L2(()=> L3(()=> L4(()=> L5(()=> L6(()=> L7(         callback ))))))   }
  else if (p3 && p8) {                 L3(()=> L4(()=> L5(()=> L6(()=> L7(()=> L8( callback ))))))   }

  else if (p1 && p5) { L1(()=> L2(()=> L3(()=> L4(()=> L5(                         callback )))))    }
  else if (p2 && p6) {         L2(()=> L3(()=> L4(()=> L5(()=> L6(                 callback )))))    }
  else if (p3 && p7) {                 L3(()=> L4(()=> L5(()=> L6(()=> L7(         callback )))))    }
  else if (p4 && p8) {                         L4(()=> L5(()=> L6(()=> L7(()=> L8( callback )))))    }

  else if (p1 && p4) { L1(()=> L2(()=> L3(()=> L4(                                 callback ))))     }
  else if (p2 && p5) {         L2(()=> L3(()=> L4(()=> L5(                         callback ))))     }
  else if (p3 && p6) {                 L3(()=> L4(()=> L5(()=> L6(                 callback ))))     }
  else if (p4 && p7) {                         L4(()=> L5(()=> L6(()=> L7(         callback ))))     }
  else if (p5 && p8) {                                 L5(()=> L6(()=> L7(()=> L8( callback ))))     }

  else if (p1 && p3) { L1(()=> L2(()=> L3(                                         callback )))      }
  else if (p2 && p4) {         L2(()=> L3(()=> L4(                                 callback )))      }
  else if (p3 && p5) {                 L3(()=> L4(()=> L5(                         callback )))      }
  else if (p4 && p6) {                         L4(()=> L5(()=> L6(                 callback )))      }
  else if (p5 && p7) {                                 L5(()=> L6(()=> L7(         callback )))      }
  else if (p6 && p8) {                                         L6(()=> L7(()=> L8( callback )))      }

  else if (p1 && p2) { L1(()=> L2(                                                 callback ))       }
  else if (p2 && p3) {         L2(()=> L3(                                         callback ))       }
  else if (p3 && p4) {                 L3(()=> L4(                                 callback ))       }
  else if (p4 && p5) {                         L4(()=> L5(                         callback ))       }
  else if (p5 && p6) {                                 L5(()=> L6(                 callback ))       }
  else if (p6 && p7) {                                         L6(()=> L7(         callback ))       }
  else if (p7 && p8) {                                                 L7(()=> L8( callback ))       }

  else if (p1) { L1(callback) }
  else if (p2) { L2(callback) }
  else if (p3) { L3(callback) }
  else if (p4) { L4(callback) }
  else if (p5) { L5(callback) }
  else if (p6) { L6(callback) }
  else if (p7) { L7(callback) }
  else if (p8) { L8(callback) }

  else { throw `cannot load that: ${st} - ${en}` }
}

function imlaai_ayat (st, en) {

  return (
    ayat.imla
      .slice(st-1,en)
      .map(a => a.startsWith('#')? a.replace('#', 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ\n') : a)
      .join('\n')
      + '\n'
  )
}

function make_words_list (st, en, cn) {  // uthmani

  // continuation; ie, append a "phrase" from the next aaya if in the same sura
  const last_aya_of_sura = sura_offset[sura_of(en)]
  if (cn && en < last_aya_of_sura) {  // don't continue if at the end of sura
    en += 1
  }
  else {
    cn = false
  }

  // const st = +suar_length.slice(0, sura_bgn).reduce((a,b)=>a+b, 0) + +aaya_bgn
  // const en = +suar_length.slice(0, sura_end).reduce((a,b)=>a+b, 0) + +aaya_end

  // all spaces are a single space in html;
  // let's make tab ('\t') separates the words,
  // and newline ('\n' with 'whitespace: pre-line') separates the ayat.

  const basmala = 'بِسۡمِ ٱللَّهِ ٱX<ل>R<رَّ>حۡمَT<ـٰ>نِ ٱX<ل>R<رَّ>حِJ<ی>مِ A<۝>D<١>'  /* uthm[0] */
      .replace(/\xa0.*/, '').replace(/ /g, '\xa0')  // '\ufdfd'

  return (
    ayat.uthm
      .slice(st-1, en)
      .reduce((arr, aya, i) => {
        // https://stackoverflow.com/a/38528645
        if (aya.startsWith('#')) {
          arr.push(basmala+'<br>')
          aya = aya.replace('#', '')
        }
        if (cn && i === en-st) {
          // based on kind_of_portion() in a.js
          aya = aya.replace(/([\u06DC\u06D6\u06D7\u06D8\u06DA\u06DB]) .*/, '$1')
        }
        arr.push(aya)
        return arr
      }, [])
      // for quran-data
      .map(a => a.replace(/أ\u064eو\u064e /g, 'أ\u064eو\u064e'))
      // continuing
      .map(a => tajweed_colorize_aaya(a))
      .map(a => a.replace(/ /g, '\t<SPC>') + '\n')
      .map(a => a.replace(/_/g, ' '))  // for tajweed
      .reduce((arr, aya) => {
        arr.push(...aya.split('<SPC>', -1))  // split and flatten
        return arr
      }, [])
  )
}
