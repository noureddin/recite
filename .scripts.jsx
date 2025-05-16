'use strict'

////////////////////////////////////////////////////////////////////////////////
// computed constants

// make el_* constants out of every element with id in .index.html
<<!!bash -c 'for id in $(grep -Po "(?<=id=\")([^\"]+)(?=\")" .index.html); do echo "const el_$id = Qid(\"$id\")"; done'>>

const sura_name = [<<!!sed "s/^/'/;s/$/',/" res/suar-names | tr -d '\n' >>]

const zhash = {
  <<!!# bash -c 'for i in i u; do printf '%s:' $i; sha256sum res/$i.zst | sed -E "s/(.{7}).*/\"\1\",/"; done' >>
}

////////////////////////////////////////////////////////////////////////////////
// my includes

<<!!cat a.js>>
<<!!cat mappings.js>>
<<!!cat opturl.js>>
<<!!cat data.js>>
<<!!cat ayaurl.js>>

<<!!# cat test.js>>
// remove the '#' in the previous line to perform some tests

<<!!cat tafsir.js>>
<<!!cat search.js>>
<<!!cat logic.js>>

<<!!cat z.js>>

////////////////////////////////////////////////////////////////////////////////
// libraries

// from: https://github.com/mathusummut/confetti.js. Copyright (c) 2018 MathuSum Mut. MIT License
<<!!cat res/confetti.min.js>>

// lzma-d-min.js from LZMA-JS by Nathan Rugg; v2.3.0; License: MIT.
// https://github.com/LZMA-JS/LZMA-JS/blob/master/src/lzma-d-min.js
<<!!cat res/lzma-d-min.js>>

// fzstd-0.1.1.js from fzstd by 101arrowz; v0.1.1; License: MIT.
// https://github.com/101arrowz/fzstd
<<!!cat res/fzstd-0.1.1.js>>

////////////////////////////////////////////////////////////////////////////////
// additional scripting

if (!(L.search + L.hash).split(/[?&#]/).includes('nostats')) {
  window.goatcounter = { path: L.href.replace(/[?#].*/,''), allow_frame: true }
  // privacy-friendly statistics, no tracking of personal data, no need for GDPR consent; see goatcounter.com
  document.body.append(make_elem('script', { Dataset: { goatcounter: 'https://recite.goatcounter.com/count' }, async: true, src: 'count.js' }))
}

