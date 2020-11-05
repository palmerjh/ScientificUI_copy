import json
import uuid

import pandas as pd
from flask import Blueprint
from flask import Response
from flask import request
from google.cloud import storage
from utils.datastore import *
from werkzeug.utils import secure_filename

import_data_component = Blueprint('import_data_component', __name__)
datastore_client = datastore.Client()


def _get_storage_client():
    return storage.Client(
        project="openag-v1")


def upload_to_bucket(blob_name, path_to_file, bucket_name):
    storage_client = _get_storage_client()

    # Make an authenticated API request
    buckets = list(storage_client.list_buckets())

    print(path_to_file)

    bucket = storage_client.get_bucket("scientific-ui-data")

    print(path_to_file)
    blob = bucket.blob(blob_name)
    blob.upload_from_filename(path_to_file)

    # returns a public url
    return blob.public_url




def convert_to_time_stamp(date_str,time_str):
    return str(date_str)[0:4] + "-"+str(date_str)[4:6] +"-"+ str(date_str)[6:8] + " " + str(time_str)

# ------------------------------------------------------------------------------
# List all the experiments
@import_data_component.route('/api/import_data_component/', methods=['GET', 'POST'])
def import_data():
    experiment_uuid = request.form["experiment_uuid"]
    sampling_time = request.form["sampling_time"]
    file = request.files['file']
    target = "./data_docs/"
    filename = secure_filename(file.filename)
    destination = "".join([target, filename])
    file.save(destination)

    df = pd.read_csv(destination)
    available_columns = df.columns.tolist()
    key = datastore_client.key('ExperimentBaysData')

    bay_ids = list(set(df['bay'].tolist()))
    bay_json = {}
    for bay_id in bay_ids:
        bay_json[bay_id] = {}
        sub_df = df.loc[df['bay'] == bay_id]
        sub_df = sub_df.sort_values(by=['date','time'])
        date_strs = sub_df["date"].tolist()[0::sampling_time]
        time_strs = sub_df["time"].tolist()[0::sampling_time]
        date_times_str = []
        for i in range(len(date_strs)):
            date_times_str.append(convert_to_time_stamp(date_strs[i], time_strs[i]))
        bay_json[bay_id]["date_times"] = date_times_str
        for key,value in sub_df.items():
            bay_json[bay_id][key] = sub_df[key].tolist()[0::sampling_time]


    reg_export = datastore.Entity(key, exclude_from_indexes=["bay_json"])

    reg_export.update({
        "experiment_uuid": experiment_uuid,
        "bay_id":bay_id,
        "bay_json":"DD"
    })

    datastore_client.put(reg_export)

    data = {
        "message": "200",
        "bay_env_data": bay_json,
        "available_variables":available_columns
    }
    return Response(json.dumps(data), 200, mimetype='application/json')
