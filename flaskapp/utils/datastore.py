import os, json
from google.cloud import datastore
from google.cloud import bigquery
# Eventually we won't query BigQuery because it is so slow.
# Perhaps someday we will use it again for a research console that
# uses a lot of historical data.
# This should be the only place we use queries.
from queries import queries


bigquery_client = bigquery.Client()

# Environment variables, set locally for testing and when deployed to gcloud.
path_to_google_service_account = "/Users/manvithaponnapati/Documents/ScientificUI/flaskapp/components/openag-v1-a2811dbb5eb8.json"
cloud_project_id = "openag-v1"
cloud_region = "us-east1"

# Datastore client for Google Cloud
datastore_client = datastore.Client(cloud_project_id)

DS_devices_KIND = 'Devices'
DS_device_data_KIND = 'DeviceData'
DS_experiments_KIND = 'Experiments'
DS_exp_recipes_KIND = 'ExperimentRecipes' # keyed by uuid
DS_exp_racks_KIND = 'ExperimentRacks'
DS_recipe_schema_KIND = 'RecipeSchema' # keyed by format

# keys for datastore DeviceData entity
DS_device_uuid_KEY = 'device_uuid'
DS_co2_KEY = 'air_carbon_dioxide_ppm'
DS_rh_KEY = 'air_humidity_percent'
DS_temp_KEY = 'air_temperature_celcius'
DS_led_KEY = 'light_spectrum_nm_percent'
DS_led_dist_KEY = 'light_illumination_distance_cm'
DS_led_intensity_KEY = 'light_intensity_watts'
DS_boot_KEY = 'boot'


# ------------------------------------------------------------------------------
def get_one(kind, key, value):
    query = datastore_client.query(kind=kind)
    query.add_filter(key, '=', value)
    result = list(query.fetch(1))

    if not result:
        return None

    return result[0]


# ------------------------------------------------------------------------------
def get_by_key(kind, key):
    _key = datastore_client.key(kind, key)
    _ent = datastore_client.get(_key)
    if not _ent:
        return None
    return _ent


# ------------------------------------------------------------------------------
def _bytes_to_string(bs):
    if isinstance(bs, bytes):
        bs = bs.decode('utf-8')
    return bs

# ------------------------------------------------------------------------------
# Get a dict with two arrays of the temp and humidity historical values.
# Returns a dict.
def get_temp_and_humidity_history_from_BQ(device_uuid):
    humidity_array = []
    temp_array = []
    result_json = {
        'RH': humidity_array,
        'temp': temp_array
    }
    if device_uuid is None or device_uuid is 'None':
        return result_json

    job_config = bigquery.QueryJobConfig()
    job_config.use_legacy_sql = False
    query_str = queries.formatQuery(
        queries.fetch_temp_results_history, device_uuid)
    query_job = bigquery_client.query(query_str, job_config=job_config)
    query_result = query_job.result()
    for row in list(query_result):
        rvalues = row[2]  # can't use row.values
        values_json = (ast.literal_eval(rvalues))

        if 'air_temperature_celcius' == row.var and 'values' in values_json:
            values = values_json["values"]
            result_json["temp"].append(
                {'value': values[0]['value'], 'time': row.eastern_time})

        if 'air_humidity_percent' == row.var and 'values' in values_json:
            values = values_json["values"]
            result_json["RH"].append(
                {'value': values[0]['value'], 'time': row.eastern_time})
    return result_json

# ------------------------------------------------------------------------------
# Get a dict with two arrays of the temp and humidity historical values.
# Returns a dict.
def get_temp_and_humidity_history(device_uuid):
    humidity_array = []
    temp_array = []
    result_json = {
        'RH': humidity_array,
        'temp': temp_array
    }
    if device_uuid is None or device_uuid is 'None':
        return result_json

    # First, try to get the data from the datastore...
    device_data = get_by_key(DS_device_data_KIND, device_uuid)
    if device_data is None or \
            (DS_temp_KEY not in device_data and \
                         DS_rh_KEY not in device_data):
        # If we didn't find any data in the DS, look in BQ...
        return get_temp_and_humidity_history_from_BQ(device_uuid)

    # process the vars list from the DS into the same format as BQ

    # Get temp values
    if DS_temp_KEY in device_data:
        valuesList = device_data[DS_temp_KEY]
        for val in valuesList:
            ts = _bytes_to_string(val['timestamp'])
            value = _bytes_to_string(val['value'])
            result_json["temp"].append({'value': value, 'time': ts})

    # Get RH values
    if DS_rh_KEY in device_data:
        valuesList = device_data[DS_rh_KEY]
        for val in valuesList:
            ts = _bytes_to_string(val['timestamp'])
            value = _bytes_to_string(val['value'])
            result_json["RH"].append({'value': value, 'time': ts})

    return result_json

# NOTE: The XX_from_BQ() methods are only used if there is no data found
# in the Datastore.   Eventually we will phase out the BQ functions (slow).


# ------------------------------------------------------------------------------
# Get the historical CO2 values for this device.
# Returns a list.
def get_co2_history_from_BQ(device_uuid):
    if device_uuid is None or device_uuid is 'None':
        return []
    job_config = bigquery.QueryJobConfig()
    job_config.use_legacy_sql = False

    query_str = queries.formatQuery(
        queries.fetch_co2_results_history, device_uuid)

    query_job = bigquery_client.query(query_str, job_config=job_config)
    query_result = query_job.result()
    results = []
    for row in list(query_result):
        values_json = (ast.literal_eval(row[1]))
        if "values" in values_json:
            values = values_json["values"]
            results.append({'value': values[0]['value'],
                            'time': row.eastern_time})
    return results


# ------------------------------------------------------------------------------
# Get the historical CO2 values for this device.
# Returns a list.
def get_co2_history(device_uuid):
    if device_uuid is None or device_uuid is 'None':
        return []

    # First, try to get the data from the datastore...
    device_data = get_by_key(DS_device_data_KIND, device_uuid)
    if device_data is None or DS_co2_KEY not in device_data:
        # If we didn't find any data in the DS, look in BQ...
        return get_co2_history_from_BQ(device_uuid)

    # process the vars list from the DS into the same format as BQ
    results = []
    valuesList = device_data[DS_co2_KEY]
    for val in valuesList:
        ts = _bytes_to_string(val['timestamp'])
        value = _bytes_to_string(val['value'])
        results.append({'value': value, 'time': ts})
    return results


#------------------------------------------------------------------------------
"""
Return a list of active devices that have data cached in the DeviceData
datastore entity.

Get the boot message for each device from DeviceData entity.
- handle missing values in the dict (from old brain code).
- one of the 20 test EDUs:
    {"device_config": "pfc3-v0.3.0", "package_version": null, "IP": "172.17.0.233", "access_point": "BeagleBone-4DAF", "bbb_serial": "1824BBWG0556", "remote_URL": "https://1824BBWG0556.serveo.net"}

- one of the 5 WIRED eth BBBs in FS#3:
    {"device_config": "fs-rack-v0.2.0-double", "package_version": null, "IP": "172.17.3.31", "access_point": "cat: /tmp/hostapd-wl18xx.conf: No such file or directory", "bbb_serial": "4417BBBK0026", "remote_URL": "https://4417BBBK0026.serveo.net"}
"""
def get_list_of_devices_from_DS():
    devicesList = [] # list of devices we return

    # first get a list of device uuid and name from the Devices entity
    query = datastore_client.query(kind=DS_devices_KIND)
    devices = list(query.fetch()) # get all devices
    for d in devices:
        device_uuid = d.get('device_uuid', '')
        device_name = d.get('device_name', '')
        if 0 < len(device_uuid):
            dd = get_by_key(DS_device_data_KIND, device_uuid)
            if dd is not None and DS_boot_KEY in dd:
                boot = dd.get(DS_boot_KEY) # list of boot messages

                # get latest boot message
                last_boot = boot[0].get('value')

                # convert binary into string and then a dict
                boot_dict = json.loads(_bytes_to_string(last_boot))

                # the serveo link needs to be lower case
                remote_URL = boot_dict.get('remote_URL')
                if remote_URL is not None:
                    remote_URL = remote_URL.lower()

                # get the AP
                access_point = boot_dict.get('access_point')
                if access_point is None:
                    access_point = ''
                # extract just the wifi code
                if access_point.startswith('BeagleBone-'):
                    ap = access_point.split('-')
                    if 2 <= len(ap):
                        access_point = ap[1]
                # handle the error if it was a wired eth. BBB
                if access_point.startswith('cat'):
                    access_point = 'eth'

                # add this device to the list
                label = device_name
                if 0 < len(access_point):
                    label = access_point + ', ' + device_name
                devicesList.append({
                    "label": label,
                    "value": device_uuid,
                    "device_name": device_name,
                    "access_point": access_point,
                    "remote_URL": remote_URL,
                })
    return devicesList
