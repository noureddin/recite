web:
	perl -CSAD -nE 'while(s/<<!!(.*?)>>/`$$1`/ge){} print' recite.html > index.html
	# perl -CSAD minify.pl index.html > index.min.html 

array:
	rm -f webres/othmani-array
	bash webres/mkarray webres/othmani-array
