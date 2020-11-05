import os, json
from passlib.hash import pbkdf2_sha256

from flask import Blueprint, request

from utils.basic_auth import auth
from utils.response import success_response, error_response


# ------------------------------------------------------------------------------
login_component = Blueprint('login_component', __name__)


# ------------------------------------------------------------------------------
# Log in a pre-defined user.
@login_component.route('/api/login/', methods=['POST'])
@auth.login_required
def login():
    received_form_response = json.loads(request.data.decode('utf-8'))
    return success_response(
        message='Success',
        is_admin=True,
    )
    # username = received_form_response.get('username')
    # if not username:
    #     return error_response(message='Username is missing.')
    #
    # password = received_form_response.get('password')
    # if not password:
    #     return error_response(message='Password is missing.')
    #
    # admin_username = 'admin'
    # if not admin_username:
    #     return error_response(
    #         message='Internal configuration error, missing env. var.')
    #
    # admin_password = 'debugrob'
    # if not admin_password:
    #     return error_response(
    #         message='Internal configuration error, missing env. var.')
    # admin_password = pbkdf2_sha256.hash(admin_password)
    #
    # view_only_username = 'admin'
    # if not view_only_username:
    #     return error_response(
    #         message='Internal configuration error, missing env. var.')
    #
    # view_only_password = 'debugrob'
    # if not view_only_password:
    #     return error_response(
    #         message='Internal configuration error, missing env. var.')
    # view_only_password = pbkdf2_sha256.hash(view_only_password)
    #
    # if username == admin_username:
    #     if pbkdf2_sha256.verify(password, admin_password):
    #         return success_response(
    #             message='Success',
    #             is_admin= True,
    #         )
    #
    # if username == view_only_username:
    #     if pbkdf2_sha256.verify(password, view_only_password):
    #         return success_response(
    #             message='Success',
    #             is_admin= False,
    #         )




