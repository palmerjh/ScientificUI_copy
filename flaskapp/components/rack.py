import json, uuid
from datetime import datetime

from flask import request
from flask import Blueprint
from flask import Response

from utils.datastore import *
from utils.basic_auth import auth

rack_component = Blueprint('rack_component', __name__)


# ------------------------------------------------------------------------------
# List all the rack
@rack_component.route('/api/submit_bays_experiment/', methods=['POST'])
@auth.login_required
def submit_racks_experiment():
    received_form_response = json.loads(request.data.decode('utf-8'))
    selected_racks = received_form_response.get("selected_racks", [])
    selected_beaglebones = received_form_response.get("selected_beaglebones", [])
    experiment_uuid = received_form_response.get("experiment_uuid","")

    # Insert into datastore
    # Add the user to the users kind of entity
    key = datastore_client.key('ExperimentBays')

    for i in range(0,len(selected_racks)):
        if selected_racks[i]:
            # Indexes every other column except the description
            rack_reg = datastore.Entity(key, exclude_from_indexes=[])
            str_uuid = uuid.uuid4()
            rack_reg.update({
                "bay_id":selected_racks[i],
                "bay_uuid":str(str_uuid),
                "bay_beagleone":selected_beaglebones[i],
                "experiment_uuid":experiment_uuid
            })

            datastore_client.put(rack_reg)

    data = json.dumps({
            "message": "Success",
            "experiment_uuid": experiment_uuid
    })
    return Response(data, 200, mimetype='application/json')

# ------------------------------------------------------------------------------
# List all the rack
@rack_component.route('/api/get_racks_by_experiment/', methods=['POST'])
@auth.login_required
def get_racks_by_experiment():
    received_form_response = json.loads(request.data.decode('utf-8'))
    experiment_uuid = received_form_response.get("experiment_uuid", {})
    query = datastore_client.query(kind='ExperimentBays')
    query.add_filter('experiment_uuid', '=', experiment_uuid)
    query_results = list(query.fetch())
    rack_results = []
    for rack in query_results:
        rack_json = {
            "bay_id": rack.get("bay_id", ""),
            "bay_uuid": rack.get("bay_uuid", ""),
            "bay_beaglebone": rack.get("bay_beagleone", ""),
        }
        rack_results.append(rack_json)
    print(rack_results)
    data = json.dumps({
        "message": "Success",
        "bays": rack_results
    })
    return Response(data, 200, mimetype='application/json')

# ------------------------------------------------------------------------------
# List all the rack
@rack_component.route('/api/get_rack_details/', methods=['POST'])
@auth.login_required
def get_rack_details():
    received_form_response = json.loads(request.data.decode('utf-8'))
    experiment_uuid = received_form_response.get("experiment_uuid", "")
    bay_uuid = received_form_response.get("bay_uuid", "")
    print(bay_uuid)
    query = datastore_client.query(kind='ExperimentBays')
    query.add_filter('experiment_uuid', '=', experiment_uuid)
    query.add_filter('bay_uuid', '=', bay_uuid)

    query_results = list(query.fetch())
    rack = query_results[0]


    rack_json = {
            "bay_beaglebone": rack.get("bay_beagleone", ""),
            "bay_id": rack.get("bay_id", "")
        }

    data = json.dumps({
        "message": "Success",
        "bay": rack_json
    })
    return Response(data, 200, mimetype='application/json')

# ------------------------------------------------------------------------------
# List all the rack
@rack_component.route('/api/submit_measurements/', methods=['POST'])
@auth.login_required
def submit_measurements():
    received_form_response = json.loads(request.data.decode('utf-8'))

    experiment_uuid = received_form_response.get("experiment_uuid", "")
    bay_uuid = received_form_response.get("bay_uuid", "")
    plants=received_form_response.get("plants",{})

    key = datastore_client.key('ExperimentPlantMeasurements')

    measurement_reg = datastore.Entity(key, exclude_from_indexes=[])

    measurement_reg.update({
        "experiment_uuid":experiment_uuid,
        "bay_uuid": bay_uuid,
        'measured_at': str(datetime.now()),
        "plant_measurment": plants
    })

    datastore_client.put(measurement_reg)



    data = json.dumps({
        "message": "Success",
        "response_code": 200
    })
    return Response(data, 200, mimetype='application/json')
