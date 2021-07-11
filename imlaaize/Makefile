t: cc.pl c.md
	perl cc.pl othmani-array-tajweed > $@

t2: c.pl
	perl c.pl othmani-array-tajweed > $@

c: t
	@perl mydiff imlaai-ayat-array t stt 

d: t
	@git diff --color-words=. --no-index -U0 imlaai-ayat-array t || true

chk:
	chk() { pad <(sed -n $1's/[A-Z<>]//g;'$1'p;'$1'q' othmani-array-tajweed ); }
