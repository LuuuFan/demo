from flask import Flask, request, render_template, url_for, redirect
from flask_socketio import SocketIO, emit, send, join_room, rooms

from pymongo import MongoClient

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

@app.route('/')
def home():
    return render_template('indext.html')


@socketio.on('online')
def test_connect(data):
    print("On Connect")
    username = data['username']
    room_id = request.sid
    print(room_id)

    conn = MongoClient("ec2-54-187-78-4.us-west-2.compute.amazonaws.com", 27017)
    db = conn['collab-tool']
    coll = db['room_id']

    user_data = {'username': username, "room_id": room_id}
    coll.delete_many({'username': username})
    coll.insert_one(user_data)
    emit('my response', {'data': 'Connected'})



@socketio.on('logout')
def test_logout(data):
    print("On DisConnect")
    username = data['username']
    room_id = request.sid

    conn = MongoClient("ec2-54-187-78-4.us-west-2.compute.amazonaws.com", 27017)
    db = conn['collab-tool']
    coll = db['room_id']

    user_data = {'username': username, "room_id": room_id}
    coll.delete_one(user_data)

    emit('my response', {'data': 'logout'})

@socketio.on('disconnect')
def test_disconnect():
    print("On DisConnect")
    
    room_id = request.sid

    conn = MongoClient("ec2-54-187-78-4.us-west-2.compute.amazonaws.com", 27017)
    db = conn['collab-tool']
    coll = db['room_id']

    user_data = {"room_id": room_id}
    coll.delete_one(user_data)

    emit('my response', {'data': 'disconnected'})



@socketio.on('send_message')
def handle_message(data):
    username = data['username']
    receiver = data['receiver']
    message = data["message"]
    print(data)
    message = dict(message)
    message["from"] = username
    # get room id of the reciever
    conn = MongoClient("ec2-54-187-78-4.us-west-2.compute.amazonaws.com", 27017)
    db = conn['collab-tool']
    coll = db['room_id']

    user_data = {'username': receiver}
    result = coll.find_one(user_data, {"_id": 0})
    print(result)
    receiver_room_id = str(result['room_id'])
    print(receiver_room_id)
    emit('receive', message, room=receiver_room_id)


if __name__ == '__main__':
    socketio.run(app, host="0.0.0.0", port=10000)
    app.run(debug=True)
