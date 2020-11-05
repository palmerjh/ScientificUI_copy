from flask import Blueprint
from flask import Response
from flask import request
import json
from utils.datastore import *
from utils.basic_auth import auth

device_details_component = Blueprint('device_details_component',__name__)

# ------------------------------------------------------------------------------
@device_details_component.route('/api/get_temp_details/', methods=['GET', 'POST'])
# @auth.login_required
def get_temp_details():
    received_form_response = json.loads(request.data.decode('utf-8'))
    device_uuid = received_form_response.get("selected_device_uuid", None)

    if device_uuid is None:
        device_uuid = 'None'

    result_json = get_temp_and_humidity_history( device_uuid )

    data = json.dumps({
        "message": "Success",
        "data": result_json
    })
    return Response(data, 200, mimetype='application/json')

#------------------------------------------------------------------------------
@device_details_component.route('/api/get_co2_details/', methods=['GET', 'POST'])
# @auth.login_required
def get_co2_details():
    received_form_response = json.loads(request.data.decode('utf-8'))
    device_uuid = received_form_response.get("selected_device_uuid", None)

    if device_uuid is None:
        device_uuid = 'None'

    results = get_co2_history( device_uuid )

    data = json.dumps({
        "response_code": 200,
        "results": results
    })
    return Response(data, 200, mimetype='application/json')

#------------------------------------------------------------------------------
# Get a list of devices from the datastore.
@device_details_component.route('/api/get_devices/', methods=['GET', 'POST'])
# @auth.login_required
def get_devices():
    data = json.dumps({
        "response_code": 200,
        "devicesList": get_list_of_devices_from_DS()
    })
    return Response(data, 200, mimetype='application/json')


#------------------------------------------------------------------------------
# Get a list of devices from the datastore.
@device_details_component.route('/api/get_recipes/', methods=['GET', 'POST'])
# @auth.login_required
def get_recipes():
    data = json.dumps({
        "response_code": 200,
        "recipesList": [""]
    })
    return Response(data, 200, mimetype='application/json')


