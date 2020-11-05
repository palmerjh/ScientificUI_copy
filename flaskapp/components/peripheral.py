import json, uuid
from datetime import datetime

from flask import request
from flask import Blueprint
from flask import Response

from utils.datastore import *
from utils.basic_auth import auth

peripherals_component = Blueprint('peripherals_component', __name__)


# ------------------------------------------------------------------------------
# List all the peripherals
@peripherals_component.route('/api/get_all_peripherals/', methods=['GET'])
@auth.login_required
def get_all_peripherals():
    query = datastore_client.query(kind='ExperimentPeripherals')
    query_results = list(query.fetch())
    peripherals = []
    for peripheral in query_results:
        peripherals.append({
            "label":peripheral.get("name",""),
            "function": peripheral.get("function", ""),
            "value":peripheral.get("uuid", ""),
            "type": peripheral.get("type", ""),
            "units": peripheral.get("units", ""),
            "recipe_variables": peripheral.get("recipe_variables", ""),
        })

    #print("Here are all the peripherals")
    #print(peripherals)
    data = json.dumps({
        "message": "Success",
        "peripheralsList": peripherals
    })
    return Response(data, 200, mimetype='application/json')

