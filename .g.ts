// This is gunzipSync(), manually extracted with its dependencies
//   from src/index.ts from fflate's repo.
// gunzipSync's opts were removed.
// This is converted to an IIFE that returns a function that takes
//   a path to a gzip file, calls fetch() then calls a function
//   equivalent to strFromU8(gunzipSync(...)) on the result.
// err() is simplified a bit, and its id-to-msg now includes gzip for 6,
//   and excludes what we don't need here, so err(6) became err(4),
//   and FlateError is removed, and err() now throws unconditionally,
//   and the 'invalid' messages all say 'bad' now, as it's shorter.
// Also a few manual minifications were introduced.
// License: MIT; original source: https://github.com/101arrowz/fflate
// Based on v0.8.1 (Sep 18, 2023).


// aliases for shorter compressed code (most minifers don't do this)
const u8 = Uint8Array, u16 = Uint16Array;
const u8n = (n) => new u8(n), u16n = (n) => new u16(n);
u8.prototype.S = u8.prototype.subarray

// minify these arrays:
const x = (s) => u8n(s.split('').map(c => parseInt(c, 36)));

// // fixed length extra bits
// const fleb = u8n([0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, /* unused */ 0, 0, /* impossible */ 0]);
const fleb = x('00000000111122223333444455550000');

// // fixed distance extra bits
// const fdeb = u8n([0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, /* unused */ 0, 0]);
const fdeb = x('0000112233445566778899AABBCCDD00');

// // code length index map
// const clim = u8n([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
const clim = x('GHI08796A5B4C3D2E1F');

// get base, reverse index map from extra bits
const freb = (eb: Uint8Array, start: number) => {
  const b = u16n(31);
  for (let i = 0; i < 31; ++i) {
    b[i] = start += 1 << eb[i - 1];
  }
  // numbers here are at max 18 bits
  const r = new Int32Array(b[30]);
  for (let i = 1; i < 30; ++i) {
    for (let j = b[i]; j < b[i + 1]; ++j) {
      r[j] = ((j - b[i]) << 5) | i;
    }
  }
  return { b, r };
}

const { b: fl } = freb(fleb, 2);
// we can ignore the fact that the other numbers are wrong; they never happen anyway
fl[28] = 258
const { b: fd } = freb(fdeb, 0);

// map of value to reverse (assuming 16 bits)
const rev = u16n(32768);
for (let i = 0; i < 32768; ++i) {
  // reverse table algorithm from SO
  let x = ((i & 0xAAAA) >> 1) | ((i & 0x5555) << 1);
  x = ((x & 0xCCCC) >> 2) | ((x & 0x3333) << 2);
  x = ((x & 0xF0F0) >> 4) | ((x & 0x0F0F) << 4);
  rev[i] = (((x & 0xFF00) >> 8) | ((x & 0x00FF) << 8)) >> 1;
}

// create huffman tree from u8 "map": index -> code length for code index
// mb (max bits) must be at most 15
// TODO: optimize/split up?
const hMap = ((cd: Uint8Array, mb: number, r: 0 | 1) => {
  const s = cd.length;
  // index
  let i = 0;
  // u16 "map": index -> # of codes with bit length = index
  const l = u16n(mb);
  // length of cd must be 288 (total # of codes)
  for (; i < s; ++i) {
    if (cd[i]) ++l[cd[i] - 1];
  }
  // u16 "map": index -> minimum code for bit length = index
  const le = u16n(mb);
  for (i = 1; i < mb; ++i) {
    le[i] = (le[i - 1] + l[i - 1]) << 1;
  }
  let co: Uint16Array;
  if (r) {
    // u16 "map": index -> number of actual bits, symbol for code
    co = u16n(1 << mb);
    // bits to remove for reverser
    const rvb = 15 - mb;
    for (i = 0; i < s; ++i) {
      // ignore 0 lengths
      if (cd[i]) {
        // num encoding both symbol and bits read
        const sv = (i << 4) | cd[i];
        // free bits
        const r = mb - cd[i];
        // start value
        let v = le[cd[i] - 1]++ << r;
        // m is end value
        for (const m = v | ((1 << r) - 1); v <= m; ++v) {
          // every 16 bit value starting with the code yields the same result
          co[rev[v] >> rvb] = sv;
        }
      }
    }
  } else {
    co = u16n(s);
    for (i = 0; i < s; ++i) {
      if (cd[i]) {
        co[i] = rev[le[cd[i] - 1]++] >> (15 - cd[i]);
      }
    }
  }
  return co;
});

// fixed length tree
const flt = u8n(288);
for (let i = 0; i < 144; ++i) flt[i] = 8;
for (let i = 144; i < 256; ++i) flt[i] = 9;
for (let i = 256; i < 280; ++i) flt[i] = 7;
for (let i = 280; i < 288; ++i) flt[i] = 8;
// // fixed distance tree
// const fdt = u8n(32); for (let i = 0; i < 32; ++i) fdt[i] = 5;
const fdt = x('5'.repeat(32))
// fixed length map
const flm = /*#__PURE__*/ hMap(flt, 9, 0), flrm = /*#__PURE__*/ hMap(flt, 9, 1);
// fixed distance map
const fdm = /*#__PURE__*/ hMap(fdt, 5, 0), fdrm = /*#__PURE__*/ hMap(fdt, 5, 1);

// find max of array
const max = (a: Uint8Array | number[]) => {
  let m = a[0];
  for (let i = 1; i < a.length; ++i) {
    if (a[i] > m) m = a[i];
  }
  return m;
};

// read d, starting at bit p and mask with m
const bits = (d: Uint8Array, p: number, m: number) => {
  const o = (p / 8) | 0;
  return ((d[o] | (d[o + 1] << 8)) >> (p & 7)) & m;
}

// read d, starting at bit p continuing for at least 16 bits
const bits16 = (d: Uint8Array, p: number) => {
  const o = (p / 8) | 0;
  return ((d[o] | (d[o + 1] << 8) | (d[o + 2] << 16)) >> (p & 7));
}

// get end of byte
const shft = (p: number) => ((p + 7) / 8) | 0;

// typed array slice - allows garbage collector to free original reference,
// while being more compatible than .slice
const slc = (v: Uint8Array, s: number, e?: number) => {
  if (s == null || s < 0) s = 0;
  if (e == null || e > v.length) e = v.length;
  // can't use .constructor in case user-supplied
  return u8n(v.S(s, e));
}

// inflate state
type InflateState = {
  // lmap
  l?: Uint16Array;
  // dmap
  d?: Uint16Array;
  // lbits
  m?: number;
  // dbits
  n?: number;
  // final
  f?: number;
  // pos
  p?: number;
  // byte
  b?: number;
  // lstchk
  i: number;
};

// error codes
const ec = [
  'unexpected EOF',
  'bad block type',
  'bad length/literal',
  'bad distance',
  'bad gzip data',  // determined by compression function -- was number 6
];

const err = (ind: number, msg?: string) => {
  throw new Error(ec[ind] || msg)
}

// expands raw DEFLATE data
const inflt = (dat: Uint8Array, st: InflateState, buf?: Uint8Array, dict?: Uint8Array) => {
  // source length       dict length
  const sl = dat.length, dl = dict ? dict.length : 0;
  if (!sl || st.f && !st.l) return buf || u8n(0);
  const noBuf = !buf;
  // have to estimate size
  const resize = noBuf || st.i != 2;
  // no state
  const noSt = st.i;
  // Assumes roughly 33% compression ratio average
  if (noBuf) buf = u8n(sl * 3);
  // ensure buffer can fit at least l elements
  const cbuf = (l: number) => {
    let bl = buf.length;
    // need to increase size to fit
    if (l > bl) {
      // Double or set to necessary, whichever is greater
      const nbuf = u8n(Math.max(bl * 2, l));
      nbuf.set(buf);
      buf = nbuf;
    }
  };
  //  last chunk         bitpos           bytes
  let final = st.f || 0, pos = st.p || 0, bt = st.b || 0, lm = st.l, dm = st.d, lbt = st.m, dbt = st.n;
  // total bits
  const tbts = sl * 8;
  do {
    if (!lm) {
      // BFINAL - this is only 1 when last chunk is next
      final = bits(dat, pos, 1);
      // type: 0 = no compression, 1 = fixed huffman, 2 = dynamic huffman
      const type = bits(dat, pos + 1, 3);
      pos += 3;
      if (!type) {
        // go to end of byte boundary
        const s = shft(pos) + 4, l = dat[s - 4] | (dat[s - 3] << 8), t = s + l;
        if (t > sl) {
          if (noSt) err(0);
          break;
        }
        // ensure size
        if (resize) cbuf(bt + l);
        // Copy over uncompressed data
        buf.set(dat.S(s, t), bt);
        // Get new bitpos, update byte count
        st.b = bt += l, st.p = pos = t * 8, st.f = final;
        continue;
      }
      else if (type == 1) lm = flrm, dm = fdrm, lbt = 9, dbt = 5;
      else if (type == 2) {
        //  literal                            lengths
        const hLit = bits(dat, pos, 31) + 257, hcLen = bits(dat, pos + 10, 15) + 4;
        const tl = hLit + bits(dat, pos + 5, 31) + 1;
        pos += 14;
        // length+distance tree
        const ldt = u8n(tl);
        // code length tree
        const clt = u8n(19);
        for (let i = 0; i < hcLen; ++i) {
          // use index map to get real code
          clt[clim[i]] = bits(dat, pos + i * 3, 7);
        }
        pos += hcLen * 3;
        // code lengths bits
        const clb = max(clt), clbmsk = (1 << clb) - 1;
        // code lengths map
        const clm = hMap(clt, clb, 1);
        for (let i = 0; i < tl;) {
          const r = clm[bits(dat, pos, clbmsk)];
          // bits read
          pos += r & 15;
          // symbol
          const s = r >> 4;
          // code length to copy
          if (s < 16) {
            ldt[i++] = s;
          } else {
            //  copy   count
            let c = 0, n = 0;
            if (s == 16) n = 3 + bits(dat, pos, 3), pos += 2, c = ldt[i - 1];
            else if (s == 17) n = 3 + bits(dat, pos, 7), pos += 3;
            else if (s == 18) n = 11 + bits(dat, pos, 127), pos += 7;
            while (n--) ldt[i++] = c;
          }
        }
        //    length tree          distance tree
        const lt = ldt.S(0, hLit), dt = ldt.S(hLit);
        // max length bits
        lbt = max(lt)
        // max dist bits
        dbt = max(dt);
        lm = hMap(lt, lbt, 1);
        dm = hMap(dt, dbt, 1);
      } else err(1);
      if (pos > tbts) {
        if (noSt) err(0);
        break;
      }
    }
    // Make sure the buffer can hold this + the largest possible addition
    // Maximum chunk size (practically, theoretically infinite) is 2^17
    if (resize) cbuf(bt + 131072);
    const lms = (1 << lbt) - 1, dms = (1 << dbt) - 1;
    let lpos = pos;
    for (;; lpos = pos) {
      // bits read, code
      const c = lm[bits16(dat, pos) & lms], sym = c >> 4;
      pos += c & 15;
      if (pos > tbts) {
        if (noSt) err(0);
        break;
      }
      if (!c) err(2);
      if (sym < 256) buf[bt++] = sym;
      else if (sym == 256) {
        lpos = pos, lm = null;
        break;
      } else {
        let add = sym - 254;
        // no extra bits needed if less
        if (sym > 264) {
          // index
          const i = sym - 257, b = fleb[i];
          add = bits(dat, pos, (1 << b) - 1) + fl[i];
          pos += b;
        }
        // dist
        const d = dm[bits16(dat, pos) & dms], dsym = d >> 4;
        if (!d) err(3);
        pos += d & 15;
        let dt = fd[dsym];
        if (dsym > 3) {
          const b = fdeb[dsym];
          dt += bits16(dat, pos) & (1 << b) - 1, pos += b;
        }
        if (pos > tbts) {
          if (noSt) err(0);
          break;
        }
        if (resize) cbuf(bt + 131072);
        const end = bt + add;
        if (bt < dt) {
          const shift = dl - dt, dend = Math.min(dt, end);
          if (shift + bt < 0) err(3);
          for (; bt < dend; ++bt) buf[bt] = dict[shift + bt];
        }
        for (; bt < end; ++bt) buf[bt] = buf[bt - dt];
      }
    }
    st.l = lm, st.p = lpos, st.b = bt, st.f = final;
    if (lm) final = 1, st.m = lbt, st.d = dm, st.n = dbt;
  } while (!final)
  // don't reallocate for streams or user buffers
  return bt != buf.length && noBuf ? slc(buf, 0, bt) : buf.S(0, bt);
}

// gzip start
const gzs = (d: Uint8Array) => {
  if (d[0] != 31 || d[1] != 139 || d[2] != 8) err(4)  /* was err(6, 'invalid gzip data') */
  const flg = d[3];
  let st = 10;
  if (flg & 4) st += (d[10] | d[11] << 8) + 2;
  for (let zs = (flg >> 3 & 1) + (flg >> 4 & 1); zs > 0; zs -= !d[st++] as unknown as number);
  return st + (flg & 2);
}

// gzip length
const gzl = (d: Uint8Array) => {
  const l = d.length;
  return (d[l - 4] | d[l - 3] << 8 | d[l - 2] << 16 | d[l - 1] << 24) >>> 0;
}

/**
 * Expands GZIP data
 * @param data The data to decompress
 * @param opts The decompression options - REMOVED!
 * @returns The decompressed version of the data
 */
const gunzipSync = (data: Uint8Array) => {
  const st = gzs(data);
  if (st + 8 > data.length) err(4)  /* was err(6, 'invalid gzip data') */
  return inflt(data.S(st, -8), { i: 2 }, u8n(gzl(data)));
}

const decompress_text_from_arraybuffer = (arraybuffer, onerror) =>
  (new TextDecoder).decode(gunzipSync(u8n(arraybuffer)))

export const G = (filename) => {
  // https://developer.mozilla.org/en-US/docs/Web/API/Response/arrayBuffer
  return fetch(filename)
    .then((response) => {
      if (!response.ok) {
        err(9, 'HTTP error, status = '+response.status);  /* 9 here is undefined, to use the msg */
      }
      return response.arrayBuffer();
    })
    .then((buffer) => decompress_text_from_arraybuffer(buffer))
}

