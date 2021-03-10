#!/bin/bash

mkdir -p ./dist
rm ./dist/$1.zip 
pushd ./src/functions/$1 >/dev/null 2>/dev/null
zip -X ../../../dist/$1.zip * >/dev/null 2>/dev/null
popd >/dev/null 2>/dev/null
echo "{}"
