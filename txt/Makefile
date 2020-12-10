web:
	\cd webres && ./mkayat && \cd ..
	perl -CSAD -nE 'while(s/<<!!(.*?)>>/`$$1`/ge){} print' recite.html > index.html
