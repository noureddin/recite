function button_attrs (rng) {
  return `href="../../?notitle&nopr&q=u&cn${isdark() ? '&dark' : '&light'}&${rng}" target="_blank" onclick="update()"`
}

update()
