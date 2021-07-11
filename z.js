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

function make_words_list (st, en) {

  // const st = +suar_length.slice(0, sura_bgn).reduce((a,b)=>a+b, 0) + +aaya_bgn
  // const en = +suar_length.slice(0, sura_end).reduce((a,b)=>a+b, 0) + +aaya_end

  // all spaces are a single space in html;
  // let's make tab ('\t') separates the words,
  // and newline (actually '<br>\n') separates the ayat.

  const ayat = [<<!!cat res/othmani-array-tajweed | tr -d '\n' >>]

  const basmala = ayat[0].replace(/\xa0.*/, '').replace(/ /g, '\xa0')  // '\ufdfd'

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
}

// vim: set sw=2 ts=2 et fdm=marker colorcolumn=80:
