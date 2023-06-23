from flask import Flask, Response
from flask_cors import CORS
from flask import jsonify
from flask_socketio import SocketIO, emit
from dotenv import load_dotenv

import openai
import redis
import os
import json

load_dotenv()

app = Flask(__name__)
cors = CORS(app, origins=['http://127.0.0.1:5500', '*'])
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins='*')
redis_key = 'ftb_session_'

r = redis.Redis(host=os.getenv('REDIS_HOST'), port=os.getenv('REDIS_PORT'), decode_responses=True)

@app.route("/")
def index():
    data= [{ "username": "test", "message": "Message 1" }, {"username": "test2", "message": "Hallo"}]
    return jsonify(data), 200

@socketio.on('message')
def handle_message(data):

    pretty = json.dumps(data, indent=4)
    print(pretty)

    #update session time
    r.set(redis_key + data.get('sessionId'), '', 300)

    #add message to chat
    if r.get(redis_key + data.get('sessionId') + '_' + 'messages'):
        messages = json.loads(r.get(redis_key + data.get('sessionId') + '_' + 'messages'));
        messages.append({ "username": "You", "message": data.get('message') })
        r.set(redis_key + data.get('sessionId') + '_' + 'messages', json.dumps(messages));
    else:
        messages = []
        messages.append({ "username": "You", "message": data.get('message') })
        r.set(redis_key + data.get('sessionId') + '_' + 'messages', json.dumps(messages));
    
    emit('update_user_message', messages)

    openai.api_key = os.getenv('OPEN_AI_KEY')
    completion  = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
        {
            "role": "system",
            "content": """
                You are helping people with there fifa transfers.
                You will respond always with three players.
                A com is a center offensive midfielder.
                A player in fifa has these stats:
                position: the position that a player can play
                rating: the overal rating from 1-100
                ratingAverage: the average from all other ratings, also 1-100
                pace: how fast is a player from 1-100
                shooting: shooting skill from 1-100
                passing: how good can a player pass from 1-100
                dribbling: how good can a player dribble from 1-100
                defending: how good is he at defending from 1-100
                physicality: how strong is the player from 1-100 
            """
        },
        {"role": "user", "content": data.get('message')}
        ]
        # temperature=0.6
    )

    messages = json.loads(r.get(redis_key +data.get('sessionId') + '_' + 'messages'))
    messages.append({ "username": "FifaBot", "message": completion.choices[0].message.content });
    r.set(redis_key + data.get('sessionId') + '_' + 'messages', json.dumps(messages))

    emit('messages', messages)


    return Response()

@socketio.on('connect')
def test_connect():
    return Response()

@socketio.on('register-session')
def register_session(data):
    r.set(redis_key + data, '', 300)
    emit('session-registered')

if __name__ == '__main__':
    socketio.run(app, debug=True)