#!/bin/bash

mkdir -p ./dist
rm ./dist/$1.zip 
pushd ./src/functions-edge/$1 >/dev/null 2>/dev/null
zip -X ../../../dist/$1.zip * >/dev/null 2>/dev/null
zip -jX ../../../dist/$1.zip ../config/configuration.json >dev/null 2>/dev/null
popd >/dev/null 2>/dev/null
echo "{}"
