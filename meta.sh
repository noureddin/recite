#!/bin/sh

# style
echo '<link rel="stylesheet" type="text/css" href="style.min.css?h='"$(sha256sum style.min.css | sed -E "s/(.{7}).*/\1/")"'">'


# URL='https://noureddin.github.io/recite/'
URL='https://www.noureddin.dev/recite/'
TITLE='رسيت | راجع ما تحفظ من القرآن الكريم'
DESC='تطبيق وب مجاني لمراجعة حفظ القرآن الكريم بلا كتابة، للحاسوب والمحمول.'

# see also https://iamturns.com/open-graph-image-size/
IMG=$URL'cover.png'  # 1200x630 - needs to be an absolute URL

# General
echo '<title>'"$TITLE"'</title>'
echo '<meta name="description" content="'"$DESC"'">'
echo '<link rel="canonical" href="'"$URL"'">'


# Favicon
echo '<link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png">'
echo '<link rel="icon" sizes="any" type="image/svg+xml" href="favicon.svg">'


# Open Graph (Facebook et al)
# OG doesn't follow ISO for Arabic: https://developers.facebook.com/docs/internationalization
echo '<meta property="og:locale" content="ar_AR">'
echo '<meta property="og:type" content="website">'
echo '<meta property="og:title" content="'"$TITLE"'">'
echo '<meta property="og:description" content="'"$DESC"'">'
echo '<meta property="og:image" content="'"$IMG"'">'
echo '<meta property="og:image:width" content="1120">'
echo '<meta property="og:image:height" content="630">'
echo '<meta property="og:url" content="'"$URL"'">'


# Twitter
# https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/markup
# https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/summary-card-with-large-image
echo '<meta property="twitter:card" content="summary_large_image">'
echo '<meta property="twitter:url" content="'"$URL"'">'
echo '<meta property="twitter:title" content="'"$TITLE"'">'
echo '<meta property="twitter:description" content="'"$DESC"'">'
echo '<meta property="twitter:image" content="'"$IMG"'">'
