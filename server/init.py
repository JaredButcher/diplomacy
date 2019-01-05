import websocketServer
import protocol

def recHandle(client, message):
    print(message)
        

ws = websocketServer.websocketServer(4543, recHandle)