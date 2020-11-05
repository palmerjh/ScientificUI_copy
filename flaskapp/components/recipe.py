import json, uuid, jsonschema
from datetime import datetime

from flask import request
from flask import Blueprint

from utils.datastore import *
from utils.basic_auth import auth
from utils.response import success_response, error_response

recipe_component = Blueprint('recipe_component', __name__)


# ------------------------------------------------------------------------------
# List all the recipes
@recipe_component.route('/api/get_all_recipes/', methods=['GET'])
@auth.login_required
def get_all_recipes():
    query = datastore_client.query(kind=DS_exp_recipes_KIND)
    query_results = list(query.fetch())
    recipes = []
    for recipe in query_results:

        # place holders until the second (slower) API gets this data
        exp_uuid = ''
        exp_name = ''
        rack_uuid = ''
        rack_name = ''

        recipes.append({
            'uuid': recipe.key.id_or_name,
            'name': recipe.get('name', ''),
            'authors': recipe.get('authors', ''),
            'modified': recipe.get('modified', ''),
            'experiment_name': exp_name,
            'experiment_uuid': exp_uuid,
            'rack_name': rack_name,
            'rack_uuid': rack_uuid,
        })

    return success_response(message='Success', recipes=recipes)


# ------------------------------------------------------------------------------
# Get the experiments and racks using which recipe.  
# Associated with get_all_recipes above, done as a second call because it is
# slower.
@recipe_component.route('/api/get_recipe_users/', methods=['GET'])
@auth.login_required
def get_recipe_users():

    recipe_users = {}

    query = datastore_client.query(kind=DS_exp_racks_KIND)
    query_results = list(query.fetch())
    for rack in query_results:
        rack_recipe_uuid = rack.get('recipe_uuid')
        if rack_recipe_uuid is None:
            continue

        exp_name = ''
        exp_uuid = rack.get('experiment_uuid')
        if exp_uuid is not None:
            exp = get_one(DS_experiments_KIND, 'experiment_uuid', exp_uuid)
            if exp is not None:
                exp_name = exp.get('experiment_name')

        recipe_users[rack_recipe_uuid] = {
            'rack_uuid': rack.get('rack_uuid', ''),
            'rack_name': rack.get('rack_id', ''),
            'experiment_uuid': exp_uuid,
            'experiment_name': exp_name,
        }

    return success_response(message='Success', recipe_users=recipe_users)


# ------------------------------------------------------------------------------
# Return one recipe by uuid
@recipe_component.route('/api/get_recipe/', methods=['POST'])
@auth.login_required
def get_recipe():
    received_form_response = json.loads(request.data.decode('utf-8'))
    uuid = received_form_response.get('recipe_uuid')
    if uuid is None:
        return error_response(message='Failed', recipe={})

    recipe_entity = get_by_key(DS_exp_recipes_KIND, uuid)
    recipe = recipe_entity.get('recipe')
    return success_response(message='Success', recipe=recipe)


# ------------------------------------------------------------------------------
# Delete the recipe.
@recipe_component.route('/api/delete_recipe/', methods=['POST'])
@auth.login_required
def delete_recipe():
    received_form_response = json.loads(request.data.decode('utf-8'))
    uuid = received_form_response.get('recipe_uuid')
    if uuid is None:
        return error_response(message='Failed')

    recipe_entity = get_by_key(DS_exp_recipes_KIND, uuid)
    if recipe_entity is None:
        return error_response(message='Failed, recipe not found ' + uuid)

    datastore_client.delete(key=recipe_entity.key);
    return success_response(message='Success')


# ------------------------------------------------------------------------------
# Save a new recipe, or update an existing one.
# Recipes are NOT immutable (they can be changed).
# Recipes can be shared by many racks.
#
@recipe_component.route('/api/submit_recipe/', methods=['POST'])
@auth.login_required
def submit_recipe():
    received_form_response = json.loads(request.data.decode('utf-8'))
    recipe_str = received_form_response.get('recipe',{})
    if recipe_str is None:
        return error_response(message='No recipe received.')

    recipe = None  # JSON recipe
    error_message = None
    authors = received_form_response.get('authors','')
    try:
        # make a recipe dict
        recipe = json.loads(recipe_str)

        if recipe.get('uuid') is None:
            recipe['uuid'] = str(uuid.uuid4())

        # always update the timestamp
        recipe['creation_timestamp_utc'] = \
                datetime.utcnow().strftime('%FT%XZ')

        # get schema
        rf = recipe.get('format')
        recipe_format = 'openag-phased-environment-v1'
        if rf is not None:
            recipe_format = rf
        schema_entity = get_by_key(DS_recipe_schema_KIND, recipe_format)
        schema = json.loads(schema_entity.get('schema'))

        # Validate recipe against schema
        jsonschema.validate(recipe, schema)

    except json.decoder.JSONDecodeError as e:
        error_message = "Invalid recipe json encoding: {}".format(e)
    except jsonschema.exceptions.ValidationError as e:
        error_message = "Invalid recipe json schema: {}".format(e)
        print(e)
    except KeyError as e:
        error_message = "Invalid recipe json schema: `{}` is requred".format(e)
    except Exception as e:
        error_message = "Unhandled exception: {}".format(type(e))

    if error_message is not None:
        return error_response(message=error_message)

    # Insert the recipe into the datastore DS_exp_recipes_KIND:
    #   1. Make a key.  ExperimentRecipes are keyed by the recipe UUID.
    key = datastore_client.key(DS_exp_recipes_KIND, recipe.get('uuid')) 

    #   2. Create a recipe Entity. 
    #      Indexes every column except the recipe (because JSON is large).
    recipe_entity = datastore.Entity(key, exclude_from_indexes=['recipe'])

    #   3. Update the entity and save it to the datastore.
    recipe_str = json.dumps(recipe)
    recipe_entity.update({
        'name': recipe.get('name', ''),
        'authors': authors,
        'modified': recipe.get('creation_timestamp_utc'),
        'recipe': recipe_str
    })
    datastore_client.put(recipe_entity)

    if recipe_entity.key:
        return success_response(message='Success',
            modified=recipe.get('creation_timestamp_utc'),
            uuid=recipe.get('uuid'))
    else:
        return error_response(message='Failed to save to datastore.')









