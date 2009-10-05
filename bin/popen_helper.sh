#!/bin/sh
IFS=
pid=$$
tmpdir=$1
streams=$2
cmd=$3

if [[ !( "$cmd" ) || !( "$streams" ) ]]; then
  echo "A valid command or set of streams were not provided."
  exit 1
fi
  
if [[ ( $tmpdir ) && ( -d "$tmpdir" ) && ( -w "$tmpdir" ) ]]; then
  stdin="&0"
  stdout="&1"
  stderr="&2"
  
  IFS=","
  
  for streamname in $streams; do
    export "$streamname"="$tmpdir/$pid.$streamname.pipe"
    mkfifo -m 600 "$tmpdir/$pid.$streamname.pipe"
    exit=$?
    test $exit -gt 0 && exit $exit
  done
  
  IFS=
  shift && shift && shift

  eval "exec 2>$stderr"
  eval "exec 3<$stdin"
  eval "exec 1>$stdout"
    
  $cmd $* <&3
  
  status=$?
  IFS=","  
  for streamname in $streams; do
    rm "$tmpdir/$pid.$streamname.pipe"
  done
  
  IFS=
  exit $status
else
  echo "Temporary directory \"$tmpdir\" doesn't exist or is not writable."
  exit 1
fi