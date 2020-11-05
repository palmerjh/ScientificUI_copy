from flask import Response
import json

def error_response(**kwargs):
    kwargs["response_code"] = 500
    kwargs["ok"] = False
    return json_response(**kwargs)

def success_response(**kwargs):
    kwargs["response_code"] = 200
    kwargs["ok"] = True
    return json_response(**kwargs)

def json_response(**kwargs):
    data = json.dumps(kwargs)
    return Response(data, kwargs["response_code"], mimetype='application/json')

