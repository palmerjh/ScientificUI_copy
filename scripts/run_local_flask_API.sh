#!/bin/bash

# Run the python Flask API locally for development.

# Get the path to THIS script (in the scripts dir), and go to the parent dir.
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"/..

# Copy our google cloud service account key to the app (never check these in!)
cp $DIR/config/*service_account.json $DIR/flaskapp

# Deactivate any current python virtual environment we may be running.
if ! [ -z "${VIRTUAL_ENV}" ] ; then
    deactivate
fi
source $DIR/flaskapp/pyenv/bin/activate

cd $DIR/flaskapp
export PYTHONPATH=./lib
export FLASK_APP=main.py
export GOOGLE_APPLICATION_CREDENTIALS=./service_account.json
export GCLOUD_PROJECT=openag-v1
export GCLOUD_REGION=us-central1

# There are real passwords in app.yaml for when we deploy this.
export ADMIN_USERNAME=admin
export ADMIN_PASSWORD=debugrob
export VIEW_ONLY_USERNAME=openag
export VIEW_ONLY_PASSWORD=debugrob

python3 -m flask run
