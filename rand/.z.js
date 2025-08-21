// partially from recite/z.js and fraed/.utils.js

function z (lzma_file, callback) {
  fetch(lzma_file)
    .then((res) => res.ok ? res.arrayBuffer() : null)
    .then((buf) => {
      callback(LZMA.decompress(new Uint8Array(buf)).split('\n').slice(0,-1))
    })
}

//

String.prototype.r = String.prototype.replace

String.prototype._count = function (rx) {  // must be /.../g (#matchAll is new-ish)
  const m = this.match(rx)
  return m ? m.length : 0
}

//

// remove MOST mosħaf formatting signs
// operates on the aayah string itself
// copied from fraed/.utils.js unmark() with two modifications:
//   not removing the ayah end (but removing the ayah number), and removing our tajweed marks
function unmark2 (aayah) {
  return (aayah
    // on the aayah level
    .r(/[٠١٢٣٤٥٦٧٨٩]+/, '')  // remove ayah number (but keep ayah end)
    .r(/[A-Z<>]+/g, '')  // our tajweed color-coding marks
    .r(/#/g, '# ')  // make basmala a separate word (because in Recite it is)
    //
    .r(/\xa0\u06e9/, '')  // place of sajdah
    .r(/\u06de\xa0/, '')  // start of rub el hizb
    // on the word level
    .r(/[\u06d6-\u06dc]+(?=$| )/g, '')  // waqf signs ('+' for 036:052)
    .r(/^(.)\u0651/g, '$1')  // remove initial shadda-of-idgham
    // on the character level
    .r(/\u0305/g, '')  // combining overline
  )
}

// remove final tashkeel signs
// operates on a single-word string
// copied exactly from fraed/.utils.js deirab()
function deirab (word) {
  return (word
    // remove madd-monfasel & madd sela
    .r(/[\u06e4-\u06e6]+$/g, '')
    // remove final tashkeel (except shadda)
    .r(/\u06e1$/,              '')    // jazm (quranic sukun)
    .r(/[\u064e-\u0650]$/,     '')    // fatha, damma, kasra
    .r(/[\u064c\u064d]$/,      '')    // tanween {damm, kasr}
    .r(/[\u08f1\u08f2]$/,      '')    // open tanween {damm, kasr}
    .r(/\u064f\u06e2$/,        '')    // iqlab tanween damm
    .r(/\u0650\u06ed$/,        '')    // iqlab tanween kasr
    .r(/\u06e2$/,              '')    // iqlab on final noon
    .r(/(ا)\u06df$/,           '$1')  // remove rounded zero from final alef
    .r(/(ى)\u0670$/,           '$1')  // remove dagger alef from final alef maqsura
        // (its existence depends on the first letter of the next word)
    .r(/\u064b([اى]?)$/,       '$1')  // tanween fath
    .r(/\u08f0([اى]?)$/,       '$1')  // open tanween fath
    .r(/\u064e\u06e2([اى]?)$/, '$1')  // iqlab tanween fath
    .r(/\u064e([اى]?)$/,       '$1')  // just fath, before final alef (either kind), because of tanween (eg, إذا)
    .r(/\u06e4(ا)$/,           '$1')  // madd before the final silent alef after waw
  )
}

const histogram = (arr) => {  // converts an array to a mapping of each value to its number of occurrences in the array
  const h = new Map()  // .has(), .delete(), .clear(), .set(), .get(), .size
  for (let e of arr) {
    const oldcount = h.has(e) ? h.get(e) : 0
    h.set(e, oldcount + 1)
  }
  return h
}

//

function load_prefixes (ayat, fn) {
  z(`../../res/u.lzma`, (A) => {
    const MAX_AYAT = 6236

    // note: unmark2() not fraed's unmark(), to keep the end-of-ayah mark
    const AA = Array(MAX_AYAT)
    const ans = Array(MAX_AYAT)
    for (let i = 0; i < MAX_AYAT; ++i) {
      if (ayat.indexOf(i+1) === -1) { continue }  // ayat[] has the 1-based indices of the wanted ayat
      AA[i] = unmark2(A[i])
    }

    // const min_ayat = new Map()  // has i => n, where i is 1-based aya number and n is the least number of ayat it needs if more than three
    // // that's because prefixes can be serval ayat. one example: 23/5--8 & 70/29--32 are FOUR identical ayat, thus a quiz then can't be less than five ayat.
    const max_ayat = new Set()  // when the unique prefix of an ayah is three complete ayat or more, it's quizzed at the max length of six ayat

    const prefix = (i, n) => {
      if (n === 1) { return deirab(AA[i].replace(/ .*/, '')) }  // first word
      //
      const nwords = 1 + AA[i]._count(/ /g)
      //
      if (nwords > n) {
        const rx = new RegExp('(' + (' [^ ]*'.repeat(n-1)) + ') .*')
        return deirab(AA[i].replace(rx, '$1'))  // keep only first n words
      }
      else if (nwords === n) {
        return AA[i]
      }
      else {  // n > nwords
        return AA[i] + '\n' + prefix(i+1, n - nwords)
      }
    }

    const wanted_ayat = (new Set(ayat)).size  // because /rand/ allows repeating suar to increase their probability

    for (let n = 1; Object.keys(ans).length < wanted_ayat; ++n) {
      const prefixes = Array(MAX_AYAT)
      for (let i = 0; i < MAX_AYAT; ++i) {
        if (!AA[i] || ans[i]) { continue }  // if not needed, or its unique prefix is already found
        prefixes[i] = prefix(i, n)
      }
      for (let [k,v] of histogram(prefixes)) {
        if (v === 1) {
          const i = prefixes.indexOf(k)
          ans[i] = n
          if (k._count(/\u06dd/g) >= 3) { max_ayat.add(i) }
          // const complete_ayat_count = k._count(/\u06dd/g)
          // if (complete_ayat_count >= 3) {
          //   min_ayat.set(i+1, complete_ayat_count + 1)
          // }
        }
      }
    }

    // for (let i = 0; i < MAX_AYAT; ++i) {
    //   if (!ans[i]) { continue }
    //   // console.log(i+1, ans[i])
    //   const p = prefix(i, ans[i])
    //   if (p._count(/\u06dd/g) > 2) {
    //     // console.log(i+1, AA.slice(i,i+6).join('\n'))  // if tested with /?1-114, we can see it's safe to unconditionally extend the range (see button_attrs() in .s.js)
    //     console.log(i+1, p)
    //   }
    // }

    fn(ans, max_ayat)
  })
}
