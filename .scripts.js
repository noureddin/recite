'use strict'

<<!!cat a.gen.js>>
<<!!cat mappings.js>>
<<!!cat tajlorligilumi.js>>
<<!!cat data.gen.js>>
<<!!cat versligilumi.js>>

// from: https://github.com/mathusummut/confetti.js. Copyright (c) 2018 MathuSum Mut. MIT License
<<!!cat res/confetti.min.js>>

<<!!#cat test.js>>
// remove the '#' in the previous line to perform the tests

<<!!cat tafsir.js>>
<<!!cat search.js>>
<<!!cat javascript.js>>

// lzma-d-min.js from LZMA-JS by Nathan Rugg; v2.3.0; License: MIT.
// https://github.com/LZMA-JS/LZMA-JS/blob/master/src/lzma-d-min.js
<<!!cat .lzma-d-min.js>>

<<!!cat z.js>>

window.goatcounter = { path: location.href.replace(/[?#].*/,''), allow_frame: true }
// privacy-friendly statistics, no tracking of personal data, no need for GDPR consent; see goatcounter.com
document.body.append(make_elem('script', { Dataset: { goatcounter: 'https://recite.goatcounter.com/count' }, async: true, src: '//gc.zgo.at/count.js' }))
