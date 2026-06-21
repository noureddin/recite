// darkmode

const set_dark = (dark) => {
  document.body.classList.toggle('dark', dark)
  for (let a of document.querySelectorAll('a[href*="&"]')) {
    a.href = dark
      ? a.href.replace(/&light&/g, '&dark&')
      : a.href.replace(/&dark&/g, '&light&')
  }
}

let u_dark  // user-defined during the session
window.rr_set_dark = (dark) => {
  u_dark = dark
  set_dark(dark)
}

const m_dark = window.matchMedia('(prefers-color-scheme:dark)')

let l_dark = localStorage.getItem('dark')
// ^ it's truthy if there is a Recite preference ("Y" or "N"); it takes precedence over @media

const isdark = () =>
  u_dark != null ? u_dark
  : l_dark ? l_dark === 'Y'
    : m_dark.matches

onfocus = () => {
  l_dark = localStorage.getItem('dark')
  set_dark(isdark())
}

if (l_dark) {
  set_dark(l_dark === 'Y')
}
else {
  m_dark.onchange = () => set_dark(isdark())
  m_dark.onchange()
}

// utils

const Qid = (id) => document.getElementById(id)

const rand_index         =   (b) => Math.floor(         b     *Math.random())  // [0, b[
const rand_int_inclusive = (a,b) => Math.floor(a + (1 + b - a)*Math.random())  // [a, b]

const range = (n) => n ? [...Array(n).keys()] : []

// non-data constants

const T = Qid('T')
const B = Qid('B')
const F = Qid('F')

const A = () => B.getElementsByTagName('a')[0]

// data

const sura_length = [7,286,200,176,120,165,206,75,129,109,123,111,43,52,99,128,111,110,98,135,112,78,118,64,77,227,93,88,69,60,34,30,73,54,45,83,182,88,75,85,54,53,89,59,37,35,38,29,18,45,60,49,62,55,78,96,29,22,24,13,14,11,11,18,12,12,30,52,52,44,28,28,20,56,40,31,50,40,46,42,29,19,36,25,22,17,19,26,30,20,15,21,11,8,8,19,5,8,8,11,11,8,3,9,5,4,7,3,6,3,5,4,5,6]

const sura_name = ['الفاتحة','البقرة','آل عمران','النساء','المائدة','الأنعام','الأعراف','الأنفال','التوبة','يونس','هود','يوسف','الرعد','إبراهيم','الحجر','النحل','الإسراء','الكهف','مريم','طه','الأنبياء','الحج','المؤمنون','النور','الفرقان','الشعراء','النمل','القصص','العنكبوت','الروم','لقمان','السجدة','الأحزاب','سبأ','فاطر','يس','الصافات','ص','الزمر','غافر','فصلت','الشورى','الزخرف','الدخان','الجاثية','الأحقاف','محمد','الفتح','الحجرات','ق','الذاريات','الطور','النجم','القمر','الرحمن','الواقعة','الحديد','المجادلة','الحشر','الممتحنة','الصف','الجمعة','المنافقون','التغابن','الطلاق','التحريم','الملك','القلم','الحاقة','المعارج','نوح','الجن','المزمل','المدثر','القيامة','الإنسان','المرسلات','النبأ','النازعات','عبس','التكوير','الانفطار','المطففين','الانشقاق','البروج','الطارق','الأعلى','الغاشية','الفجر','البلد','الشمس','الليل','الضحى','الشرح','التين','العلق','القدر','البينة','الزلزلة','العاديات','القارعة','التكاثر','العصر','الهمزة','الفيل','قريش','الماعون','الكوثر','الكافرون','النصر','المسد','الإخلاص','الفلق','الناس',]

function start_ (s) { return +sura_length.slice(0, s).reduce((a, b) => a + b, 0) }
const sura_offset = range(115).map(start_)  // array mapping 0-based suar to how many ayat before it (eg 0 => 0, 1 => 7, 2 => 286+7)
// thus sura_offset if given a 1-based sura gives the 1-based index of its last aaya
function sura_of (a) { return range(115).find((i) => sura_offset[i] >= a) }  // takes 1-based aaya ∈ [1-6236], returns its 1-based sura

// specific utils

const full_sura = (n) => range(sura_length[n-1]).map(i => 1 + i + sura_offset[n-1])
const entire_suar = (a,b) => b ? range(1+(+b)-a).flatMap(i => full_sura(i+(+a))) : full_sura(a)

// user input

const given_ranges =
  (location.search + location.hash)
    .split(/[#?,]/).filter(e => {
      if (!e) { return false }  // empty or null or zero
      if (e.indexOf('-') === -1) {  // a single sura
        return !isNaN(+e) && +e >= 1 && +e <= 114
      }
      const [a, z] = e.split('-')  // more-than-two are ignored everywhere (e.g, 1-5-8 is treated as 1-5 only)
      return (
        (!isNaN(+a) && +a >= 1 && +a <= 114) &&
        (!isNaN(+z) && +z >= 1 && +z <= 114) &&
        (+a <= +z)
      )
    })

const ayat = given_ranges
    .flatMap(n => entire_suar(...n.split('-')))

if (ayat.length === 0) {
  location.href = '../gen/'
}

// suar names
T.innerHTML = given_ranges.map(e => {
  const [a, z] = e.split('-')
  if (z == null || +a === +z) {  // one sura
    return 'سورة ' + sura_name[a-1]
  }
  else if (+a+1 === +z) {  // 2 suratan
    return 'سورتي ' + sura_name[a-1] + ' و' + sura_name[a]  // note: oblique case
  }
  else {  // many suar
    return 'السور من ' + sura_name[a-1] + ' إلى ' + sura_name[z-1]
  }
}).join('<br>و')

F.innerHTML = `<a target="_blank" href="../gen/?${given_ranges.join(',')}">غيّر سور التسميع أو نوعه</a>`

function update () {
  let   a = ayat[rand_index(ayat.length)]
  const sura_1based = sura_of(a)
  const last_aya = sura_offset[sura_1based]
  const z = Math.min(last_aya, a + rand_int_inclusive(2, 5))  /* 3-6 ayat */
  const old_a = a
  // note: z-a == 2 if it's three ayat to recite
  while (z - a < 2 && sura_of(a-1) === sura_1based) { --a }
  const rng = a + '-' + z
  //
  B.innerHTML = '<a ' + button_attrs(rng) + '>ابدأ تسميعًا عشوائيًّا</a>'
  A().focus()
}
