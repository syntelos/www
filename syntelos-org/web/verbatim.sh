#!/bin/bash

progn=$(basename $0)
progd=$(dirname $0)

function usage {
 echo "Usage"
 echo "   $0 file.src "
 echo 
 echo "Description"
 echo
 echo "   Format source text as an SVG 'top' paragraph. "
 echo
 exit 1
}

if [ -z "${1}" ]
then
 usage
elif [ -f "${1}" ]
then
 file="${1}"
 cat<<EOF
<svg        x="800"
            y="0"
        width="450"
       height="800"
     overflow="hidden"
 preserveAspectRatio="xMinYMin meet"
      viewBox="0 0 900 1600">

 <text x="3" font-family="Courier" font-size="20px" fill="#909090" onload="top_textlayout(this,22)">
EOF
 counter=0
 for line in $(cat ${file} | sed 's/ /%X%/g')
 do
  line=$(echo ${line} | sed 's/%X%/ /g; s%&%\&amp;%g; s%<%\&lt;%g; s%>%\&gt;%g')
  if [ 0 -eq ${counter} ]
  then
   echo "  <tspan y=\"3\">${line}</tspan>"
  else
   echo "  <tspan>${line}</tspan>"
  fi
  counter=$(( ${counter} + 1 ))
 done
 cat<<EOF
 </text>
</svg>
EOF
else
 usage
fi
