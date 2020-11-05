#!/bin/bash

if [ $# -eq 0 ]; then
    echo "Please provide the API name on the command line."
    echo "Examples: get_all_experiments"
    exit 1
fi
API=$1

SERVER=localhost:5000
#SERVER=sciflask-dot-openag-v1.appspot.com

echo "Be patient, this will take a minute..."
echo ""

curl $SERVER/api/$API/ -H 'Content-Type: application/json' -H 'Authorization: Basic Q3JhenlFaWdodHlFaWdodDg4OkxvbmczNCtTZWtyMXRIYWhA'

echo ""
