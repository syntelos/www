#!/bin/bash

progn=$(basename $0)
progd=$(dirname $0)

if [ ! -x "$(which crlf2lf)" ]
then
 echo "Missing 'crlf2lf'."
 exit 1
fi

function usage {
 echo "Usage "
 echo "    ${progn} file 'source.js'"
 echo "    ${progn} member 'Syntelos.XLink.xmlns'"
 echo
 echo "Description"
 echo
 echo "    Interactively generate documentation templates."
 echo 
 echo "Options"
 echo
 echo "    file    --  Gen docs for the functions defined "
 echo "                in 'source.js'."
 echo
 echo "    member  --  Gen doc for member.  For example: "
 echo "                  ${progn} member Syntelos.SVG.xmlns"
 echo "                  ${progn} member Syntelos_SOME_fun(elem,name)"
 echo
 exit 1
}

function inputN {
 if [ "$1" ]
 then
  while true
  do
   if read -ep "$1" inputN_response
   then
    if [ -z "${inputN_response}" ]||[ 'n' = ${inputN_response} ]
    then
     return 1 ##(special)
    else
     return 0 ##(special)
    fi
   else
    continue
   fi
  done
 else
  echo "inputN user error requires prompt"
  exit 1
 fi
}
function typeof {
  case ${1} in
   *svg*)
    echo "SVGSVGElement";;
   *elem)
    echo "Element";;
   *node)
    echo "Element";;
   *name)
    echo "String";;
   *sep)
    echo "String";;
   *val)
    echo "Number";;
   *ary)
    echo "Array";;
   *source)
    echo "Element";;
   *target)
    echo "Element";;
   *)
    echo "Object";;
  esac 
}

function file {
 sourcef=${1}

 for fun in $(cat ${sourcef} | crlf2lf | egrep '^function ' | sed 's/function //; s/ //g; s/{//' | egrep -v '^_')
 do
  member ${fun}
 done
}
function member {
 if [ -z "${1}" ]
 then
  return 1
 else
  fun=$(echo ${1} | sed 's%\.%_%g; s%/%_%g') ##(normalize)

  fun_name=$(echo ${fun} | sed 's/(.*//')
  fun_parms=$(echo ${fun} | sed "s/${fun_name}//; s/[)(]//g; s/,/ /g")
  fun_libn=$(echo ${fun_name} | sed 's/_/./g')
  target="docs/$(echo ${fun_name}  | sed 's/_/\//g').xml"
  target_dir=$(dirname ${target})
  if [ ! -d ${target_dir} ]
  then
   mkdir -p ${target_dir}
  fi
  if [ ! -f ${target} ]|| inputN "?Overwrite '${target}'? [Ny] " 
  then
   cat<<EOF > ${target}
<?xml version="1.0" encoding="UTF-8"?>
<doc:lib.member xmlns:doc="ns:org/syntelos/js/docs">
 <doc:lib.type>function</doc:lib.type>
 <doc:lib.name>${fun_libn}</doc:lib.name>
 <doc:source>
  <doc:source.file>/js/${sourcef}</doc:source.file>
  <doc:source.name>${fun_name}</doc:source.name>
  <doc:source.line>${this_lno}</doc:source.line>
 </doc:source>
 <doc:location>/js/${target}</doc:location>
 <doc:desc type="text/html">

 </doc:desc>
EOF
   for param_name in ${fun_parms}
   do
    param_class=$(typeof ${param_name})
    cat<<EOF >> ${target}

 <doc:param doc:param.name="${param_name}">
  <doc:param.class>${param_class}</doc:param.class>
  <doc:desc type="text/html">

  </doc:desc>
 </doc:param>
EOF
   done
   cat<<EOF >> ${target}

 <doc:return>
  <doc:param.class></doc:param.class>
  <doc:desc type="text/html">

  </doc:desc>
 </doc:return>
</doc:lib.member>
EOF
   echo ${target}
   return 0
  fi
 fi
}

if [ "${1}" ]
then
 case "${1}" in
  file)
   if [ -n "$2" ]&&[ -f "$2" ]
   then
    if file "${2}"
    then
     exit 0
    else
     exit 1
    fi
   else
    usage 
   fi ;;
  member)

   while member "$2"
   do
     shift
   done
   exit 0
   ;;
  *)
   usage ;;
 esac
else
 usage
fi

