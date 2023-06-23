# Fifa chatbot

## Perquisite
* Docker installed locale (optional, only used for redis)
* Python3
* [OpenAI Token](https://platform.openai.com/account/api-keys)
* Node v18

# How to start
Go into the server folder and rename the `.env.dist` to `.env` then update the redis settings, so they will fit your local environment.    
Also add your `OpenAI Token` there.
Install all the needed python dependencies: `requirements.txt` is provided.
You can use the provided `docker-compose.yaml` to start up redis.
## Start the server
Make sure your redis is running. Then open a Terminal and navigate to the `server` folder. Then run this command: `python3 app.py`      

## Start the client
**Important** if you have configured the server to not run on `127.0.0.1` please make sure to update this line: `http://127.0.0.1:5000`, this is for the `socket.io` connection.
Then open a Terminal and navigate to the `fifa-client` folder.   
Then run this commands:
```
yarn install
yarn dev
```
This will start the client on `http://localhost:3000`
