from flask import Flask
from flask_cors import CORS
from components import (experiment, login, peripheral, rack, device_details,
        recipe)
app = Flask(__name__)

cors = CORS(app, resources={r"/api/*": {"origins": "*"}})
CORS(app)


#------------------------------------------------------------------------------
app.register_blueprint(experiment.experiment_component)
app.register_blueprint(login.login_component)
app.register_blueprint(peripheral.peripherals_component)
app.register_blueprint(rack.rack_component)
app.register_blueprint(device_details.device_details_component)
app.register_blueprint(recipe.recipe_component)
# app.register_blueprint(importdata.import_data_component)

#------------------------------------------------------------------------------
if __name__ == '__main__':
    # This is used when running locally. Gunicorn is used to run the
    # application on Google App Engine. See entrypoint in app.yaml.
    app.run(host='127.0.0.1', port=5000, debug=True, threaded=True)
