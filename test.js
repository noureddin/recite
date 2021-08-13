// ligilumi: reading url parameters {{{
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
    ['#',               null,          null],
    ['?',               null,          null],
    ['',                null,          null],
    ['#d',              null,          null],
    ['?d',              null,          null],
    ['d',               null,          null],
  ]
  .forEach((t) => {
    [st, en, d] = _ligilumilo(t[0])
    if (st !== t[1] || en !== t[2]) {
      console.log('ligilumi', t[0], ' got', st, en, ' exp', t[1], t[2])
      fail += 1
    }
    all += 1
  })
  console.log('ligilumi test finished;', fail, 'failed out of', all)
}/**/ // }}}

// make_title: human readable version of the range to recite {{{
function test_make_title () {
  let fail=0, all=0, out, cls
  // Remember: all numbers here are 1-based.
  [
    [[1,1,1,1], 'تسميع الآية الأولى من سورة الفاتحة'],
    [[1,7,1,7], 'تسميع الآية الأخيرة من سورة الفاتحة'],
    [[1,4,1,4], 'تسميع الآية ٤ من سورة الفاتحة'],
    [[1,1,1,3], 'تسميع سورة الفاتحة من الآية الأولى حتى الآية ٣'],
    [[1,6,1,7], 'تسميع سورة الفاتحة من الآية ٦ حتى الآية الأخيرة'],
    [[2,1,2,286], 'تسميع سورة البقرة كاملة'],
    [[1,1,2,286], 'تسميع سورتي الفاتحة والبقرة كاملتين'],
    // [[1,1,3,200], 'تسميع سور الفاتحة والبقرة وآل عمران كاملة'],
    [[1,1,3,200], 'تسميع السور من الفاتحة حتى آل عمران'],
    [[1,1,114,6], 'تسميع السور من الفاتحة حتى الناس'],
    [[1,1,3,199], 'تسميع من سورة الفاتحة الآية الأولى حتى سورة آل عمران الآية ١٩٩'],
  ]
  .forEach((t) => {
    [out, cls] = make_title(...t[0])
    out = out.replace(/\xa0/g, ' ')  // NBSP
    if (out !== t[1]) {
      console.log('make_title', t[0], ' got', out, ' exp', t[1])
      fail += 1
    }
    all += 1
  })
  console.log('make_title test finished;', fail, 'failed out of', all)
}/**/ // }}}

test_ligilumi()
test_make_title()

// vim: set sw=2 ts=2 et fdm=marker colorcolumn=80:
