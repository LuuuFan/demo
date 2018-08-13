import io
import os
import time
import shutil

from pymongo import MongoClient
from passlib.hash import pbkdf2_sha256 as sha256
import requests


class UserModel:
    __databaseName__ = 'collab-tool'
    __tableName__ = 'user-info'

    def __init__(self, username, passHash):
        self.username = username
        self.password = passHash
        self.user_id = 0

    @classmethod
    def generate_hash(cls, password):
        return sha256.hash(password)

    @staticmethod
    def verify_hash(password, hash):
        return sha256.verify(password, hash)

    def save_to_db(self):
        conn = MongoClient("localhost", 27017)

        db = conn[self.__databaseName__]
        coll = db[self  .__tableName__]

        user_data = {'username': self.username, 'password': self.password}

        d = coll.find({'username': self.username})
        count = d.count()
        for ds in d:
            print(ds)
        print(count)
        if count == 0:
            self.user_id = coll.insert_one(user_data).inserted_id
            conn.close()
            return True

        return False

    @classmethod
    def find_by_username(cls, username):
        conn = MongoClient("localhost", 27017)
        db = conn[cls.__databaseName__]
        coll = db[cls.__tableName__]

        result = coll.find_one({'username': username})

        conn.close()
        return result


class FileModel:
    # TODO: Check if adding the token is necessary
    # TODO: Adding thumbor images

    __databaseName__ = 'collab-tool'
    __tableName__ = 'images-link'

    def __init__(self, filename, username):
        self.filename = filename
        self.username = username
        self.file_id = ""

    def save_metadata(self):
        from CollabServer import app
        conn = MongoClient("localhost", 27017)

        db = conn[self.__databaseName__]
        coll = db[self.__tableName__]

        data = {
            'filename': self.filename,
            'user_id': self.username,
            'tags': self.__get_tags(),
            'webformat_url': app.config["HOSTNAME"] + "/get_images/for_thumbor/" + self.username + "/" + self.filename,  # http://serveraddresss/get_images/image1.jpg

            'previewUrl': self.__get_thumbor(),
            'LastModified': time.time()
        }

        self.file_id = coll.insert_one(data).inserted_id
        conn.close()
        return True

    def __get_thumbor(self):
        from CollabServer import app
        return "http://34.216.224.153/unsafe/60x90/" + app.config['HOSTNAME'] + "/get_images/for_thumbor/" + self.username + "/" + self.filename

    def __get_tags(self):
        from google.cloud import vision
        from google.cloud.vision import types

        filedir = 'files' + "/" + self.username + "/"
        client = vision.ImageAnnotatorClient()
        file_name = filedir + self.filename

        with io.open(file_name, 'rb') as image_file:
            content = image_file.read()
        tags = []
        image = types.Image(content=content)
        response = client.label_detection(image=image)
        labels = response.label_annotations

        for label in labels:
            print(label.description)
            tags.append(label.description)
        # thumborUrl="http://54.186.153.173/unsafe/300x200/"
        # localUrl="http://54.186.153.173:9000/images/"
        # print thumborUrl+localUrl+filename
        # res = urllib2.urlopen(thumborUrl+localUrl+filename)
        # response = res.read()
        # output = open(filedir+'/300x200/'+filename,"wb")
        # output.write(response)
        # output.close()
        return tags

    def delete_file(self):
        conn = MongoClient("localhost", 27017)

        db = conn[self.__databaseName__]
        coll = db[self.__tableName__]

        query = {"filename": self.filename}
        coll.delete_one(query)

        conn.close()
        pass

    @classmethod
    def get_all_files(cls, username):
        conn = MongoClient("localhost", 27017)

        db = conn[cls.__databaseName__]
        coll = db[cls.__tableName__]

        query = {"user_id": username}
        # result = [image for image in coll.find(query, {"_id":0})]
        result = []
        cursor = coll.find(query, {"_id": 0})
        for temp in cursor:
            result.append({
                "previewURL": temp["previewUrl"],
                "webformatURL": temp["webformat_url"]
            })

        conn.close()
        return result

    @classmethod
    def remove_Object_id(cls, image):
        pass

    @classmethod
    def get_all_templates(cls):
        conn = MongoClient("localhost", 27017)

        db = conn[cls.__databaseName__]
        coll = db['templates']

        #result = [image for image in coll.find({"info.type" : "Anniversary"})]
        result = []
        cursor = coll.find({"info.type": "Anniversary"})
        for temp in cursor:
            result.append({
                "tag": temp["info"]["type"],
                "image": temp["screen"]
            })
        print(result)
        conn.close()
        return result


class RevokedTokenModel:
    __databaseName__ = 'collab-tool'
    __tableName__ = 'revoked_tokens'

    def __init__(self, jti):
        self.jti = jti
        self.token_id = ""

    def add(self):
        conn = MongoClient("localhost", 27017)

        db = conn[self.__databaseName__]
        coll = db[self.__tableName__]

        data = {
            "token": self.jti
        }

        self.token_id = coll.insert_one(data).inserted_id
        conn.close()
        return

    @classmethod
    def is_jti_blacklisted(cls, token):

        conn = MongoClient("localhost", 27017)

        db = conn[cls.__databaseName__]
        coll = db[cls.__tableName__]

        query = coll.find({'token': token})

        conn.close()

        if query.count() > 0:
            return True
        return False
