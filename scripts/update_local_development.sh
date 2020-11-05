#!/bin/bash

# Update the python/flask and node/react environments for local development.

# Get the path to THIS script (in the scripts dir), and go to the parent dir.
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"/..
cd $DIR

# Deactivate any current python virtual environment we may be running.
if ! [ -z "${VIRTUAL_ENV}" ] ; then
    deactivate
fi

source $DIR/flaskapp/pyenv/bin/activate

cd $DIR/flaskapp
pip install --upgrade -t lib -r requirements.txt

cd $DIR/reactapp
npm install --save
