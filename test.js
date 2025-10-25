// parsing verses url parameters {{{
function test_ayaurl () {
  let fail=0, all=0
  ;[
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
    ['#',               null,          null],
    ['?',               null,          null],
    ['',                null,          null],
    ['#d',              null,          null],
    ['?d',              null,          null],
    ['d',               null,          null],
  ]
  .forEach((t) => {
    let [st, en] = __ayaurl(t[0].split(/[ ?#&]|%20/))
    if (st !== t[1] || en !== t[2]) {
      console.log('ayaurl', t[0], ' got', st, en, ' exp', t[1], t[2])
      fail += 1
    }
    all += 1
  })
  console.log('ayaurl test finished;', fail, 'failed out of', all)
}/**/ // }}}

// make_title: human readable version of the range to recite {{{
function test_make_title () {
  let fail=0, all=0, out, cls
  // Remember: all numbers here are 1-based.
  ;[
    [[1,1,1,1], 'تسميع الآية الأولى من سورة الفاتحة'],
    [[1,7,1,7], 'تسميع الآية ٧ الأخيرة من سورة الفاتحة'],
    [[1,4,1,4], 'تسميع الآية ٤ من سورة الفاتحة'],
    [[1,4,1,5], 'تسميع الآيتين ٤ و٥ من سورة الفاتحة'],
    [[1,6,1,7], 'تسميع الآيتين ٦ و٧ الأخيرة من سورة الفاتحة'],
    [[1,2,1,7], 'تسميع سورة الفاتحة من الآية ٢ حتى الآية ٧ الأخيرة'],
    [[1,1,1,3], 'تسميع سورة الفاتحة من الآية الأولى حتى الآية ٣'],
    [[2,1,2,286], 'تسميع سورة البقرة كاملة'],
    [[1,1,2,286], 'تسميع سورتي الفاتحة والبقرة كاملتين'],
    // [[1,1,3,200], 'تسميع سور الفاتحة والبقرة وآل عمران كاملة'],
    [[1,1,3,200], 'تسميع السور من الفاتحة حتى آل عمران'],
    [[1,1,114,6], 'تسميع السور من الفاتحة حتى الناس'],
    [[1,1,3,199], 'تسميع من سورة الفاتحة الآية الأولى حتى سورة آل عمران الآية ١٩٩'],
  ]
  .forEach((t) => {
    out = make_title(...t[0])
    out = out.replace(/\xa0/g, ' ')  // NBSP
    if (out !== t[1]) {
      console.log('make_title', t[0], ' got', out, ' exp', t[1])
      fail += 1
    }
    all += 1
  })
  console.log('make_title test finished;', fail, 'failed out of', all)
}/**/ // }}}

// sura_of: takes 1-based aaya ∈ [1-6236], returns its 1-based sura number {{{
function test_sura_of () {
  let fail=0, all=0, out, cls
  ;[
    [1, 1],
    [2, 1],
    [7, 1],
    [8, 2],
    [sura_offset[  1-1]+1,  1],
    [sura_offset[  2-1],    1],
    [sura_offset[  2-1]+1,  2],
    [sura_offset[  3-1],    2],
    [sura_offset[  3-1]+1,  3],
    [sura_offset[ 10-1],    9],
    [sura_offset[ 10-1]+1,  10],
    [sura_offset[ 12-1]+1,  12],
    [sura_offset[ 22-1]+1,  22],
    [sura_offset[ 40-1]+1,  40],
    [sura_offset[ 58-1]+1,  58],
    [sura_offset[ 67-1]+1,  67],
    [6230,   113],
    [6231,   114],
    [6232,   114],
    [6233,   114],
    [6234,   114],
    [6235,   114],
  ]
  .forEach((t) => {
    out = sura_of(t[0])
    if (out !== t[1]) {
      console.log('sura_of', t[0], ' got', out, ' exp', t[1])
      fail += 1
    }
    all += 1
  })
  console.log('sura_of test finished;', fail, 'failed out of', all)
}/**/ // }}}

// page_of: takes 1-based aaya ∈ [1-6236], returns its 1-based page number {{{
function test_page_of () {
  let fail=0, all=0, out, cls
  ;[
    [1, 1],
    [2, 1],
    [7, 1],
    [8, 2],
    [sura_offset[  1-1]+1,  1],
    [sura_offset[  2-1],    1],
    [sura_offset[  2-1]+1,  2],
    [sura_offset[  3-1],    49],
    [sura_offset[  3-1]+1,  50],
    [sura_offset[ 10-1],    207],
    [sura_offset[ 10-1]+1,  208],
    [sura_offset[ 12-1]+1,  235],
    [sura_offset[ 14-1]+1,  255],
    [sura_offset[ 17-1],    281],
    [sura_offset[ 17-1]+1,  282],
    [sura_offset[ 18-1]+1,  293],
    [sura_offset[ 19-1],    304],
    [sura_offset[ 19-1]+1,  305],
    [sura_offset[ 20-1]+1,  312],
    [sura_offset[ 21-1],    321],
    [sura_offset[ 21-1]+1,  322],
    [sura_offset[ 22-1],    331],
    [sura_offset[ 22-1]+1,  332],
    [sura_offset[ 36-1]-1,  439],
    [sura_offset[ 36-1]+1,  440],
    [sura_offset[ 40-1]+1,  467],
    [sura_offset[ 58-1],    541],
    [sura_offset[ 58-1]+1,  542],
    [sura_offset[ 67-1],    561],
    [sura_offset[ 67-1]+1,  562],
    [sura_offset[ 78-1],    581],
    [sura_offset[ 78-1]+1,  582],
    [sura_offset[ 85-1]+1,  590],
    [sura_offset[ 86-1]+1,  591],
    [sura_offset[ 87-1]+1,  591],
    [sura_offset[ 88-1]+1,  592],
    [sura_offset[ 89-1]+1,  593],
    [sura_offset[ 90-1]+1,  594],
    [sura_offset[ 91-1]+1,  595],
    [sura_offset[ 92-1]+1,  595],
    [sura_offset[ 93-1]+1,  596],
    [sura_offset[ 94-1]+1,  596],
    [sura_offset[ 95-1]+1,  597],
    [sura_offset[ 96-1]+1,  597],
    [sura_offset[ 97-1]+1,  598],
    [sura_offset[ 98-1]+1,  598],
    [sura_offset[ 99-1]+1,  599],
    [sura_offset[100-1]+1,  599],
    [sura_offset[101-1]+1,  600],
    [sura_offset[102-1]+1,  600],
    [sura_offset[103-1]+1,  601],
    [sura_offset[104-1]+1,  601],
    [sura_offset[105-1]+1,  601],
    [sura_offset[106-1]+1,  602],
    [sura_offset[107-1]+1,  602],
    [sura_offset[108-1]+1,  602],
    [sura_offset[109-1]+1,  603],
    [sura_offset[110-1]+1,  603],
    [sura_offset[111-1]+1,  603],
    [sura_offset[112-1],    603],
    [sura_offset[112-1]+1,  604],
    [6230,   604],
    [6231,   604],
    [6232,   604],
    [6233,   604],
    [6234,   604],
    [6235,   604],
  ]
  .forEach((t) => {
    out = page_of(t[0])
    if (out !== t[1]) {
      console.log('page_of', t[0], ' got', out, ' exp', t[1])
      fail += 1
    }
    all += 1
  })
  console.log('page_of test finished;', fail, 'failed out of', all)
}/**/ // }}}

test_ayaurl()
test_make_title()
test_sura_of()
test_page_of()

// vim: fdm=marker :
