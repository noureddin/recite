web:
	perl -CSAD -nE 's/<<!!(.*?)>>/`$$1`/ge; print' recite.html > index.html
