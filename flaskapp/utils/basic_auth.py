from flask_httpauth import HTTPBasicAuth 

# We are using HTTP basic auth on our Flask API to provide a bit of (easy) 
# security.  When we only allow access to the API over HTTPS, then it is secure.
# We also don't prevent testing the API from curl or a testing tool.

auth = HTTPBasicAuth() 
USER_DATA = {
    "CrazyEightyEight88": "Long34+Sekr1tHah@"
}
# Use: to get the base64 basic auth header.  (don't use the base64 util)
# curl --user <username:password> -v -v -v URL/API
# CrazyEightyEight88:Long34+Sekr1tHah@
# Q3JhenlFaWdodHlFaWdodDg4OkxvbmczNCtTZWtyMXRIYWhA

#------------------------------------------------------------------------------
@auth.verify_password
def verify(username, password):
    if not (username and password):
        return False
    return USER_DATA.get(username) == password

