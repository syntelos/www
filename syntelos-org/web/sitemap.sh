#!/bin/bash

sitemapf=sitemap.xml

cat<<EOF > ${sitemapf}
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.google.com/schemas/sitemap/0.84">
EOF

count=0
for source in $(find . -type f -name '*.html' )
do
 target=$(echo ${source} | sed 's%^\./%%')
 cat<<EOF >> ${sitemapf}
 <url>
  <loc>http://www.syntelos.com/${target}</loc>
 </url>
EOF
 count=$(( ${count} + 1 ))
done
cat<<EOF >> ${sitemapf}
</urlset>
EOF

grep '<loc>' ${sitemapf} | sed 's%.*<loc>%%; s%</loc>%%'

if [ 0 -lt ${count} ]
then
 exit 0
else
 exit 1
fi
