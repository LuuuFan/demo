import os
import time
import json
from flask import send_from_directory, request, jsonify, make_response
from flask_restful import Resource, reqparse
from models.models import UserModel, FileModel, RevokedTokenModel
from flask_jwt_extended import (
    jwt_required, create_access_token,
    get_jwt_identity, get_raw_jwt
)
import werkzeug



# TODO: [MAJOR] Check every token for expired tokens

parser = reqparse.RequestParser()
parser.add_argument('username', help='this field is required', required=True)
parser.add_argument('password', help='this field is required', required=True)

basicHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': 'true'
}


class UserRegistration(Resource):

    def options(self):
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Headers': 'Authorization'
            }
        return {'message': 'To Support CORS'}, 200, headers

    def post(self):
        data = parser.parse_args()

        new_user = UserModel(
            data["username"],
            UserModel.generate_hash(data["password"])
        )

        if new_user.save_to_db():
            os.mkdir("files/"+data['username'])
            return {
                'message': 'User {} was created successfully'.format(data['username'])
            }, 200, basicHeaders
        else:
            return {
                       'message': 'Something is wrong'
                   }, 400, basicHeaders


class UserLogin(Resource):
    def options(self):
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Headers': 'Authorization'
            }
        return {'message': 'To Support CORS'}, 200, headers

    def post(self):
        data = parser.parse_args()

        current_user = UserModel.find_by_username(data['username'])

        if not current_user:
            return {'error': 'User {} doesn\'t exist'.format(data['username'])},
            400, basicHeaders

        if UserModel.verify_hash(data['password'], current_user['password']):
            _identity = {
                'current_username' : current_user['username'],
                'timestamp': time.time()
            }
            access_token = create_access_token(identity=_identity)  # (identity=current_user['username'])

            return {'access-token': access_token,
                    'message': 'Logged in as {}'.format(data['username'])}, \
                   200, basicHeaders
        else:
            return {'error': 'Wrong Credentials'}, 400, basicHeaders


class UserLogout(Resource):
    def options(self):
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Headers': 'Authorization'
            }
        return {'message': 'To Support CORS'}, 200, headers

    @jwt_required
    def post(self):
        # encoded_token = request.headers.get('Authorization')
        # expire_token = RevokedTokenModel(encoded_token)
        # expire_token.add()
        return {'message': 'User Logout'}


class TokenRefresh(Resource):
    def options(self):
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Headers': 'Authorization'
            }
        return {'message': 'To Support CORS'}, 200, headers

    def post(self):
        return {'message': 'Token Refreshed'}


class ListAllUsers(Resource):
    def options(self):
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Headers': 'Authorization'
            }
        return {'message': 'To Support CORS'}, 200, headers

    @jwt_required
    def get(self):
        current_user = get_jwt_identity()["current_username"]
        print(current_user)
        return {'current user': current_user}, 200, basicHeaders


class FileUpload(Resource):
    def options(self):
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Headers': 'Authorization'
            }
        return {'message': 'To Support CORS'}, 200, headers

    @jwt_required
    def post(self):
        from CollabServer import app

        parse = reqparse.RequestParser()
        parse.add_argument('file', type=werkzeug.datastructures.FileStorage, location='files')
        args = parse.parse_args()
        imagefile = args['file']

        current_user = get_jwt_identity()["current_username"]
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], current_user, imagefile.filename)

        if os.path.isfile(filepath):
            # check if file is there and delete it
            os.remove(filepath)
            fileObj = FileModel(imagefile.filename, current_user)
            fileObj.delete_file()
    
        imagefile.save(os.path.join(app.config['UPLOAD_FOLDER'], current_user, imagefile.filename)) # current_user+"_"+
        file = FileModel(imagefile.filename, current_user)
        file.save_metadata()

        return {'message': 'File uploaded successfully'}


class FileDelete(Resource):
    def options(self):
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Headers': 'Authorization'
            }
        return {'message': 'To Support CORS'}, 200, headers

    @jwt_required
    def post(self):
        from CollabServer import app

        parse = reqparse.RequestParser()
        parse.add_argument('filename', required=True)
        args = parse.parse_args()
        filename = args['filename']
        current_user = get_jwt_identity()["current_username"]
        file = FileModel(filename, current_user)
        file.delete_file()
        try:
            os.remove(os.path.join(app.config['UPLOAD_FOLDER'], current_user, filename))
        except OSError:
            pass


class FileDownload(Resource):
    def options(self):
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Headers': 'Authorization'
            }
        return {'message': 'To Support CORS'}, 200, headers

    @jwt_required
    def get(self, filename):
        from CollabServer import app
        current_user = get_jwt_identity()["current_username"]
        return send_from_directory(app.config['UPLOAD_FOLDER'] + "/" + current_user, filename, as_attachment=False)


class FileDownloadThumbor(Resource):
    def options(self):
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Headers': 'Authorization'
            }
        return {'message': 'To Support CORS'}, 200, headers

    # get_images/for_thumbor/<string: username>/<path: filename>
    def get(self, username, filename):
        from CollabServer import app
        current_user = username
        response = make_response(send_from_directory(app.config['UPLOAD_FOLDER'] + "/" + current_user, filename, as_attachment=False))
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Credentials'] = 'true'
        return response


class Syntax(Resource):
    @jwt_required
    def post(self):
        current_user = get_jwt_identity()["current_username"]
        result = {
            'images': FileModel.get_all_files(current_user),
            'templates': FileModel.get_all_templates()
        }

        return json.dumps(result), 200, basicHeaders

    def options(self):
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Headers': 'Authorization'
            }
        return {'message': 'To Support CORS'}, 200, headers

