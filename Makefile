web:
	perl -CSAD -nE 'while(s/<<!!(.*?)>>/`$$1`/ge){} print' recite.html > index.html
	# perl -CSAD minify.pl index.html > index.min.html 
