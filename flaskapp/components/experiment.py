import json, uuid
from datetime import datetime
from werkzeug.utils import secure_filename

from flask import request
from flask import Blueprint
from flask import Response
import pandas as pd
from utils.datastore import *
from utils.basic_auth import auth

experiment_component = Blueprint('experiment_component', __name__)
datastore_client = datastore.Client()

# ------------------------------------------------------------------------------
# List all the experiments
@experiment_component.route('/api/get_all_experiments/', methods=['GET'])
@auth.login_required
def get_all_experiments():

    query = datastore_client.query(kind=DS_experiments_KIND)
    query_results = list(query.fetch())
    experiments = []
    for experiment in query_results:
        experiments.append({
            "experiment_name":experiment.get("experiment_name",""),
            "experiment_uuid": experiment.get("experiment_uuid", ""),
            "experiment_notes": experiment.get("experiment_notes", ""),
            "device_type": experiment.get("device_type", ""),
            "started_at": experiment.get("started_at", ""),
            "started_by": experiment.get("started_by", ""),
            'experiment_objective': experiment.get("experiment_objective", ""),
            'experiment_treatments': experiment.get("experiment_treatments", ""),
            'photo_period': experiment.get("photo_period", ""),
            'metadata': experiment.get("metadata", ""),
        })

    print("Here are all the experiments")
    print(experiments)
    data = json.dumps({
        "message": "Success",
        "experiments": experiments
    })
    return Response(data, 200, mimetype='application/json')


# ------------------------------------------------------------------------------
# List experiment inputs and ouputs
@experiment_component.route('/api/get_experiment_io/', methods=['POST'])
def get_experiment_io():
    received_form_response = json.loads(request.data.decode('utf-8'))
    experiment_uuid = received_form_response.get("experiment_uuid", {})
    query = datastore_client.query(kind=DS_experiments_KIND)
    query.add_filter('experiment_uuid', '=', experiment_uuid)
    query_results = list(query.fetch())
    experiment_json = {}
    for experiment in query_results:
        experiment_json = {
            "experiment_name":experiment.get("experiment_name",""),
            "experiment_uuid": experiment.get("experiment_uuid", ""),
            "experiment_notes": experiment.get("experiment_notes", ""),
            "device_type": experiment.get("device_type", ""),
            "started_at": experiment.get("started_at", ""),
            "started_by": experiment.get("started_by", "")
        }

    racks_query = datastore_client.query(kind='ExperimentRacks')
    racks_query.add_filter('experiment_uuid', '=', experiment_uuid)
    racks_query_results = list(racks_query.fetch())
    racks_results = []
    input_measures = []
    output_measures =[]
    for rack in racks_query_results:
        rack_peripherals = rack.get("rack_peripherals", "").split(",")
        rack_json = {
            "rack_beaglebone": rack.get("rack_beagleone", ""),
            "rack_id": rack.get("rack_id", ""),
            "rack_uuid": rack.get("rack_uuid", ""),
            "rack_peripherals": rack.get("rack_peripherals", "").split(",")
        }
        racks_results.append(rack_json)
        peripherals_json = []
        for rack_peripheral in rack_peripherals:
            peripheral_query = datastore_client.query(kind='ExperimentPeripherals')
            peripheral_query.add_filter('uuid', '=', rack_peripheral)
            peripheral_results = list(peripheral_query.fetch())
            name = peripheral_results[0]['name']
            function = peripheral_results[0]['function']

            peripherals_json.append({
                "name": name,
                "function": function,
                "measures": peripheral_results[0]["measures"]
            })
            if peripheral_results[0]["measures"]!="":
                input_measures.append("{}_rack_{}".format(peripheral_results[0]["measures"].lower(),rack.get("rack_id","")))
            else:
                output_measures.append("{}_rack_{}".format(peripheral_results[0]["measures"].lower(),rack.get("rack_id","")))



    data = json.dumps({
        "message": "Success",
        "input_measures": input_measures,
        "output_measures":output_measures
    })
    return Response(data, 200, mimetype='application/json')


# ------------------------------------------------------------------------------
# List all the experiments
@experiment_component.route('/api/get_experiment_by_uuid/', methods=['POST'])
def get_experiment_by_uuid():
    received_form_response = json.loads(request.data.decode('utf-8'))
    experiment_uuid = received_form_response.get("experiment_uuid", "")
#debugrob: TODO - replace with get_one() from utils/datastore
    query = datastore_client.query(kind="Experiments")
    print(experiment_uuid)
    query.add_filter('experiment_uuid', '=', experiment_uuid)
    query_results = list(query.fetch())
    print(query_results)
    experiment_json = {}
    print("Experiments",experiment_uuid)
    for experiment in query_results:
        experiment_json = {
            "experiment_name":experiment.get("experiment_name",""),
            "experiment_uuid": experiment.get("experiment_uuid", ""),
            "experiment_notes": experiment.get("experiment_notes", ""),
            "started_at": experiment.get("started_at", ""),
            "started_by": experiment.get("started_by", ""),
            'experiment_objective': experiment.get("experiment_objective", ""),
            'experiment_treatments': experiment.get("experiment_treatments", ""),
            'photo_period': experiment.get("photo_period", ""),
            'metadata': experiment.get("metadata", {})
        }

    data = json.dumps({
        "message": "Success",
        "experiment": experiment_json
    })
    return Response(data, 200, mimetype='application/json')


# ------------------------------------------------------------------------------
# List all the experiments
@experiment_component.route('/api/get_experiment_notes/', methods=['POST'])
def get_experiment_notes():
    received_form_response = json.loads(request.data.decode('utf-8'))
    experiment_uuid = received_form_response.get("experiment_uuid", {})
    query = datastore_client.query(kind='ExperimentNotes')
    query.add_filter('experiment_uuid', '=', experiment_uuid)
    query_results = list(query.fetch())
    experiment_json = []
    for experiment in query_results:
        experiment_json.append({
            "experiment_notes": experiment.get("notes", ""),
            "started_at": experiment.get("started_at", "")
        })

    data = json.dumps({
        "message": "Success",
        "notes": experiment_json
    })
    return Response(data, 200, mimetype='application/json')


# ------------------------------------------------------------------------------
# Submit new experiment note
@experiment_component.route('/api/submit_experiment_notes/', methods=['GET','POST'])
@auth.login_required
def submit_experiment_notes():
    received_form_response = json.loads(request.data.decode('utf-8'))
    experiment_notes = received_form_response.get("notes",'')
    experiment_uuid = received_form_response.get("experiment_uuid", "")

    #Insert into datastore
    # Add the user to the users kind of entity
    key = datastore_client.key('ExperimentNotes')
    # Indexes every other column except the description
    experiment_reg = datastore.Entity(key, exclude_from_indexes=[])

    str_uuid = uuid.uuid4()
    experiment_reg.update({
        'notes': experiment_notes,
        'experiment_uuid': experiment_uuid,
        'started_at': str(datetime.now())
    })

    datastore_client.put(experiment_reg)

    if experiment_reg.key:
        data = json.dumps({
            "message": "Success",
            "experiment_uuid":str(str_uuid)
        })
        return Response(data, 200, mimetype='application/json')
    else:
        data = json.dumps({
            "message": "Failed",
            "experiment_uuid": "N/A"
        })
        return Response(data, 500, mimetype='application/json')

# ------------------------------------------------------------------------------
# Submit new experiment form
@experiment_component.route('/api/submit_new_experiment/', methods=['GET','POST'])
@auth.login_required
def submit_new_experiment():
    received_form_response = json.loads(request.data.decode('utf-8'))
    experiment_json = received_form_response.get("experiment",{})

    #Insert into datastore
    # Add the experiment to the Experiments kind of entity
    key = datastore_client.key(DS_experiments_KIND)
    # Indexes every column except (nothing in this case!)
    experiment_reg = datastore.Entity(key, exclude_from_indexes=[])

    str_uuid = uuid.uuid4()
    experiment_reg.update({
        'experiment_name': experiment_json.get("experiment_name",""),
        'experiment_uuid': str(str_uuid),
        'experiment_notes':experiment_json.get("experiment_notes",""),
        'experiment_objective': experiment_json.get("experiment_objective", ""),
        'experiment_treatments': experiment_json.get("experiment_treatments", ""),
        'photo_period': experiment_json.get("photo_period", ""),
        "device_type":experiment_json.get("device_type",""),
        'metadata': experiment_json.get("metadata", ""),
        'started_by': experiment_json.get("started_by",""),
        'started_at': str(datetime.now()) ,
        "status":"Active",
        "ended_on":""
    })

    datastore_client.put(experiment_reg)

    if experiment_reg.key:
        data = json.dumps({
            "message": "Success",
            "experiment_uuid":str(str_uuid)
        })
        return Response(data, 200, mimetype='application/json')
    else:
        data = json.dumps({
            "message": "Failed",
            "experiment_uuid": "N/A"
        })
        return Response(data, 500, mimetype='application/json')



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
    if time_str:
        return str(date_str)[0:4] + "-"+str(date_str)[4:6] +"-"+ str(date_str)[6:8] + " " + str(time_str)
    else:
        return str(date_str)[0:4] + "-" + str(date_str)[4:6] + "-" + str(date_str)[6:8]

# ------------------------------------------------------------------------------
# List all the experiments
@experiment_component.route('/api/import_data_component/', methods=['GET', 'POST'])
def import_data():
    sampling_time = 5000
    experiment_uuid = request.form["experiment_uuid"]
    file = request.files['file']
    target = "./data_docs/"
    filename = secure_filename(file.filename)
    destination = "".join([target, filename])
    file.save(destination)
    if (".csv") in destination:
        df = pd.read_csv(destination)
    if(".xlsx") in destination:

        df = pd.ExcelFile(destination).parse("MANUAL_data_BV_FS2")
        sampling_time = 1
    available_columns = df.columns.tolist()
    df = df.fillna(value=0)
    key = datastore_client.key('ExperimentBaysData')

    bay_ids = list(set(df['bay'].tolist()))
    bay_json = {}
    for bay_id in bay_ids:
        bay_json[bay_id] = {}
        sub_df = df.loc[df['bay'] == bay_id]
        print(available_columns)

        if "time" not in available_columns:
            sub_df = sub_df.sort_values(by=['date'])
        else:
            sub_df = sub_df.sort_values(by=['date', 'time'])

        date_strs = sub_df["date"].tolist()[0::sampling_time]
        if "time" not in available_columns:
            time_strs = ["" for x in sub_df["time"].tolist()[0::sampling_time]]
        else:
            time_strs = sub_df["time"].tolist()[0::sampling_time]


        date_times_str = []
        for i in range(len(date_strs)):
            date_times_str.append(convert_to_time_stamp(date_strs[i], time_strs[i]))

        bay_json[bay_id]["date_times"] = date_times_str
        for key,value in sub_df.items():
            bay_json[bay_id][key] = sub_df[key].tolist()[0::sampling_time]

        # Insert into datastore
        # Add the user to the users kind of ExperimentBaysData
        key = datastore_client.key('ExperimentBaysData')
        # Indexes every other column except the description
        experiment_reg = datastore.Entity(key, exclude_from_indexes=['bay_json'])


        experiment_reg.update({
            'bay_id': bay_id,
            "sampling_time":sampling_time,
            "filename":filename,
            'experiment_uuid': experiment_uuid,
            'bay_json': str(json.dumps(bay_json[bay_id]))
        })

        datastore_client.put(experiment_reg)

    data = {
        "message": "200",
        "bay_env_data": bay_json,
        "available_variables":available_columns
    }
    return Response(json.dumps(data), 200, mimetype='application/json')


@experiment_component.route('/api/get_experiment_bay_data/', methods=['GET', 'POST'])
def get_experiment_bay_data():
    received_form_response = json.loads(request.data.decode('utf-8'))
    experiment_uuid = received_form_response.get("experiment_uuid")
    print(experiment_uuid)
    query = datastore_client.query(kind='ExperimentBaysData')
    query.add_filter('experiment_uuid', '=', experiment_uuid)
    query_results = list(query.fetch())

    bay_ids = []
    for query_result in query_results:
        bay_ids.append(query_result['bay_id'])

    bay_json ={}
    for bay_id in bay_ids:
        bay_json[bay_id] = {}
        for query_result in query_results:
            if query_result['bay_id'] == bay_id:
                for k,v in json.loads(query_result['bay_json']).items():
                    bay_json[bay_id][k] = v



    available_variables=[]
    for key,value in bay_json[bay_ids[0]].items():
        available_variables.append(key)

    print(bay_json)
    data = {
        "message": "200",
        "bay_env_data":json.dumps(bay_json),
        "available_variables":available_variables
    }


    return Response(json.dumps(data), 200, mimetype='application/json')