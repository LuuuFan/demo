# flask-server app
# ├── views.py     # views of the server
# ├── models.py    # database models
# ├── resources.py # API endpoints
# └── CollabServer.py       # main script to start the server
import os

from flask import Flask, request, redirect, url_for
from flask_restful import Api
from flask_jwt_extended import JWTManager

from resources import resources

ALLOWED_EXTENSIONS = set(['pdf', 'png', 'jpg', 'jpeg'])

app = Flask(__name__)
api = Api(app)
app.config.from_pyfile('instance/flask.cfg')

os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = app.config['GOOGLE_APPLICATION_CREDENTIALS']
jwt = JWTManager(app)

api.add_resource(resources.UserRegistration, '/registration')
api.add_resource(resources.UserLogin, '/login')
api.add_resource(resources.UserLogout, '/logout')
api.add_resource(resources.TokenRefresh, '/token/refresh')
api.add_resource(resources.ListAllUsers, '/users')
api.add_resource(resources.FileUpload, '/upload')
api.add_resource(resources.FileDelete, '/deletefile')
api.add_resource(resources.FileDownload, '/get_image/<path:filename>')
api.add_resource(resources.FileDownloadThumbor, '/get_images/for_thumbor/<string:username>/<path:filename>')
api.add_resource(resources.Syntax, '/syntax')


if __name__ == '__main__':
    if not os.path.exists("files"):
        os.makedirs("files")
    app.run(debug=True, host='127.0.0.1', port=8999)
